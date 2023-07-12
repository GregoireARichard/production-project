import { Router } from "express";
import { ApiError } from "../../utility/Error/ApiError";
import { ErrorCode } from "../../utility/Error/ErrorCode";
import { Body, Post, Get, Query, Route, Security, Request } from 'tsoa';
import {SSH} from '../../utility/SSH';
import { Crud } from '../../utility/Crud';
import { DB } from "../../utility/DB";
import { RowDataPacket } from "mysql2";
import mysql, { Pool } from 'mysql2/promise';
import type { IDefaultExerciseResponse } from "../../types/IDefaultExerciseResponse";
import { IErrorExercise } from "../../types/IErrorExercise";
import { NodeSSH } from "node-ssh";
import { errorMonitor } from "mysql2/typings/mysql/lib/Connection";
import { IExerciseBody } from "../../types/IExerciseBody";
import { IExerciseFullBody } from "../../types/IExerciseFullBody";
import { getExercises, insertOrUpdateExerciseResult, isGroupExerciseActive } from "../../utility/repository";
import { IExercise } from "../../types/IExercise";
import IIsGroupExercise from "../../types/IIsGroupExerciseActive";
import IIsGroupExerciseActive from "../../types/IIsGroupExerciseActive";
import { IMetaUserInfoSGBDRRO, IMetaUserInfoSSHRO } from "../../model/Meta_user_info/IMetaUserInfos";
import { IExerciseRO } from "../../model/Exercise/IExercise";
import { IPreviousExercises } from "../../types/IPreviousExercises";


const router = Router({ mergeParams: true });

@Route("/production")
@Security('jwt')
export class ProductionExerciseController{

    private static readonly SSH_COMMAND_TIMEOUT = 10000;
      
    @Post("/exercise")
    public async runExercise(@Body() body: IExerciseBody, @Request() request: any) 
    {
        const isExerciceActive = await isGroupExerciseActive(body.group_id)
        if (typeof isExerciceActive !== "boolean") return isExerciceActive

        try {
            const { userId } =  request.user;

            const AllExercises = await getExercises(body.group_id);
            const totalPoints: number = AllExercises.reduce((acc, curr) => acc + curr.points, 0);
            let user_points = 0;
            let potentialResponse = await this.prepareExerciseResponse(AllExercises[0], user_points, totalPoints, false);
            

            const ssh = await this.GetSSHConnexion(userId, body as IExerciseFullBody);
            
            if ('status_code' in ssh) {
                potentialResponse.error = ssh;
                
                return potentialResponse;
            }
            await insertOrUpdateExerciseResult(AllExercises[0], userId);
            user_points += AllExercises[0].points;

            potentialResponse = await this.prepareExerciseResponse(AllExercises[1], user_points, totalPoints, false);

            const mysql_connexion = await this.getMysqlTunnelConnexion(ssh, userId, body as IExerciseFullBody, AllExercises);

            if ('status_code' in mysql_connexion) {
                potentialResponse.passed = this.getPreviousExercises(AllExercises, 2);
                potentialResponse.error = mysql_connexion;

                return potentialResponse;
            }
            await insertOrUpdateExerciseResult(AllExercises[1], userId);
            user_points += AllExercises[1].points;
              
            //Test boucle infini: i=0; while true; do ((i++)); sleep 1; done
            for (const exercise of AllExercises) {
                
                potentialResponse = await this.prepareExerciseResponse(exercise, user_points, totalPoints, this.getPreviousExercises(AllExercises, exercise.question_number));

                if (exercise.command) {
                  try {
                    let command_test = await this.executeExerciseCommand(ssh, exercise.command, potentialResponse);
                    
                    if (typeof command_test === 'object' && 'error' in command_test) return command_test;
                    if (command_test !== exercise.expected) throw Error("La valeur attendu n'est pas la bonne");

                  } catch (err: any) {
                    const error: IErrorExercise = {
                        title: "Command Error",
                        message: err.message || "SSH Command Error",
                        status_code: 500
                    };
        
                    potentialResponse.error = error;
                    return potentialResponse;
                  }
                }
          
                if (exercise.query) {

                  try {

                    let query_test = await this.executeExerciseQuery(mysql_connexion, exercise.query, potentialResponse);
                    if ('error' in query_test) return query_test;
                    if (query_test !== exercise.expected) throw Error("La valeur attendu n'est pas la bonne");

                  } catch (err: any) {

                    const error: IErrorExercise = {
                        title: "Query Error",
                        message: err.message || "SQL Query Error",
                        status_code: 500
                    };
                    
                    potentialResponse.error = error;
                    return potentialResponse;
                  }
                }
          
                // On UPDATE en DB Test réussi
                await insertOrUpdateExerciseResult(exercise, userId);
                user_points += exercise.points;
              }
          
              mysql_connexion.release();
              ssh.dispose();

            const exerciseResponse: IDefaultExerciseResponse = this.ExerciseResponse(
                false,
                "Fini",
                "",
                "",
                user_points,
                0,
                totalPoints,
                this.getPreviousExercises(AllExercises, AllExercises.length)
            );

            // On insère en DB Test Terminé

            return exerciseResponse;

        } catch (error) {
            console.error(error);
        }
    }

    private getPreviousExercises(AllExercises: IExerciseRO[], index: number): IPreviousExercises
    {
        const passedExercises =  AllExercises
                                .slice(0, index-1)
                                .map(({ id, command, query, expected, ...exercise }) => exercise);

        return { exercises: passedExercises };
    }

    private async prepareExerciseResponse(exercice: IExerciseRO, userPoints: number, totalPoints: number, exercisesPassed: IPreviousExercises | false): Promise<IDefaultExerciseResponse>
    { 
        const potentialResponse: IDefaultExerciseResponse = this.ExerciseResponse(
            false,
            exercice.name,
            exercice.description,
            exercice.clue,
            userPoints | 0,
            exercice.points,
            totalPoints,
            exercisesPassed
        );

        return potentialResponse
    }

    private async GetSSHConnexion(userId: number, body: IExerciseFullBody): Promise<NodeSSH | IErrorExercise>
    {
        try {
            const db = DB.Connection;
            const isMetaSSH = await db.query<RowDataPacket[]>(`select COUNT(*) as nb_rows from meta_user_info where id_user = ? AND type='ssh'`, [userId]);
            
            if(isMetaSSH[0][0].nb_rows === 0)
            {
                try {
                    const data = {id_user: userId, type: body.name, host: body.test.host, username: body.test.username, port: body.test?.port || 22}
                    await db.query<RowDataPacket[]>(`insert into meta_user_info set ?`, data);
                } catch (error) {
                    console.log("error:", error);
                    throw new Error("missing informations");
                }
            }else if (body.name === "ssh"){
                try {
                    const data = {host: body.test.host, username: body.test.username,port: body.test?.port || 22 };
                    await db.query<RowDataPacket[]>(`UPDATE meta_user_info SET ? WHERE id_user = ? AND type = 'ssh'`, [data, userId]);
                } catch (error) {
                    console.log("error:", error);
                    throw new Error("missing informations");
                }
            }

            const ssh_meta_result = await db.query<IMetaUserInfoSSHRO & RowDataPacket[]>(`select * from meta_user_info where id_user = ? AND type='ssh'`, [userId]);

            const ssh_meta = ssh_meta_result[0][0];
            
            const ssh = await SSH.getSSHConnexion({
                host: ssh_meta.host,
                username: ssh_meta.username,
                port: ssh_meta.port || 22
            });

            if(!ssh) {
                throw new Error("SSH connection failed");
            }

            return ssh;

        } catch (err: any) {
            const error: IErrorExercise = {
                title: "ssh/connexion failed",
                message: err.message || "SSH connection failed",
                status_code: 500
            };
            return error;
        }
    }

    private async getMysqlTunnelConnexion(ssh: NodeSSH, userId: number, body: IExerciseFullBody, AllExercises: IExerciseRO[]): Promise< mysql.PoolConnection | IErrorExercise>
    {
        try {
            const db = DB.Connection;

            const isMetaDb = await db.query<RowDataPacket[]>(`select COUNT(*) as nb_rows from meta_user_info where id_user = ? AND type='sgbdr'`, [userId]);
            
            if(isMetaDb[0][0].nb_rows === 0 && body.name === "sgbdr")
            {
                try {
                    const data = {id_user: userId, type: body.name, host: body.test?.host || "localhost", username: body.test.username, password: body.test.password, port: body.test?.port || 3306 }
                    await db.query<RowDataPacket[]>(`insert into meta_user_info set ?`, data);
                } catch (error) {
                    console.log("error:", error);
                    throw new Error("probably missing informations");
                }
            }else if (body.name === "sgbdr"){
                try {
                    const data = {host: body.test.host, username: body.test.username, password: body.test.password, port: body.test?.port || 3306 };
                    await db.query<RowDataPacket[]>(`UPDATE meta_user_info SET ? WHERE id_user = ? AND type = 'sgbdr'`, [data, userId]);
                } catch (error) {
                    console.log("error:", error);
                    throw new Error("missing informations");
                }
            }

            const mysql_meta_result = await db.query<IMetaUserInfoSGBDRRO & RowDataPacket[]>(`select * from meta_user_info where id_user = ? AND type='sgbdr'`, [userId]);
            
            const mysql_meta = mysql_meta_result[0][0];

            const sshTunnel = await SSH.SSHTunnel(
                ssh,
                mysql_meta.host,
                mysql_meta.port,
                mysql_meta.host,
                mysql_meta.port
              );
              
            const mysql_pool = mysql.createPool({
                host: mysql_meta.host,
                user: mysql_meta.username,
                password: mysql_meta.password,
                database: 'rgpd',
                port: mysql_meta.port,
                stream: sshTunnel
            });
              
            const mysql_connexion = await mysql_pool.getConnection();

            if(!mysql_connexion)
            {
                throw new Error("MYSQL connection failed");
            }

            return mysql_connexion;

        } catch (err: any) {
            const error: IErrorExercise = {
                title: "mysql/connexion failed",
                message: err.message || "MYSQL connection failed",
                status_code: 500
            };

            return error;
            
        }
    }

    private async executeCommandWithTimeout(ssh: NodeSSH, command: string, timeout: number): Promise<string> {
        return new Promise((resolve, reject) => {
          const commandTimeout = setTimeout(() => {
            reject(new Error("Command execution timed out"));
          }, timeout);
    
          ssh.execCommand(command)
            .then(result => {
              clearTimeout(commandTimeout);
              if(result.stderr.length > 0)
              {
                reject(new Error(result.stderr))
              }
              resolve(result.stdout);
            })
            .catch(error => {
              clearTimeout(commandTimeout);
              reject(error);
            });
        });
      }

    private async executeExerciseCommand(ssh: any, command: any, exerciseResponse: IDefaultExerciseResponse): Promise<string|IDefaultExerciseResponse>
    {
        try {
            const command_test = await this.executeCommandWithTimeout(ssh, command, ProductionExerciseController.SSH_COMMAND_TIMEOUT);
            
            return command_test;

          } catch (err: any) {

            const error: IErrorExercise = {
                title: "SSH Error",
                message: err.message || "SSH Connexion Failed with Timeout",
                status_code: 500
            };

            exerciseResponse.error = error;

            return exerciseResponse;
          }
    }

    private async executeExerciseQuery(mysql_connexion: any, query: any, exerciseResponse: IDefaultExerciseResponse)
    {
        try {
            const query_test = await mysql_connexion.query(query);

            return query_test;
          } catch (err: any) {

            const error: IErrorExercise = {
                title: "mysql/connexion failed",
                message: err.message || "La requête SQL à échoué pour une raison inconnu",
                status_code: 500
            };

            exerciseResponse.error = error;

            return exerciseResponse;
          }
    }

    private ExerciseResponse(
        error: IErrorExercise | false,
        name: string,
        description: string,
        clue: string | false,
        userPoints: number,
        exercisePoints: number,
        totalPoints: number,
        passed: IPreviousExercises | false
      ): IDefaultExerciseResponse {

        const response: IDefaultExerciseResponse = {
          error: error,
          name: name,
          description: description,
          clue: clue,
          user_points: userPoints,
          exercise_points: exercisePoints,
          total_point: totalPoints,
          passed: passed
        };
      
        return response;
      }
}

