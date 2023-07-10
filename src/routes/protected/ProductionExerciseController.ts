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
import { getExercises, isGroupExerciseActive } from "../../utility/repository";
import { IExercise } from "../../types/IExercise";
import IIsGroupExercise from "../../types/IIsGroupExerciseActive";
import IIsGroupExerciseActive from "../../types/IIsGroupExerciseActive";
import { IMetaUserInfoSGBDRRO, IMetaUserInfoSSHRO } from "../../model/Meta_user_info/IMetaUserInfos";
import { IExerciseRO } from "../../model/Exercise/IExercise";


const router = Router({ mergeParams: true });

@Route("/production")
@Security('jwt')
export class ProductionExerciseController{

    private static readonly SSH_COMMAND_TIMEOUT = 10000;

    @Post("/exercise")
    public async runExercise(@Body() body: any, @Request() request: any) 
    {
        const isExerciceActive = await isGroupExerciseActive(body.group_id)
        if (typeof isExerciceActive !== "boolean") return isExerciceActive

        try {
            const { userId } =  request.user;

            const ssh =  await this.GetSSHConnexion(userId, body as IExerciseFullBody);
            
            if ('error' in ssh) {
                return ssh;
            }
            // On insère en DB Test réussi

            const mysql_connexion = await this.getMysqlTunnelConnexion(ssh, userId, body as IExerciseFullBody);

            if ('error' in mysql_connexion) {
                return mysql_connexion;
            }
            // On UPDATE en DB Test réussi
              
            const NextExercises = await getExercises(body.group_id);
            
            for (const exercise of NextExercises) {
                let potentialResponse = await this.prepareExerciseResponse(exercise);
                console.log("toto", exercise);
                if (exercise.command) {
                    console.log("tata");
                  try {
                    let command_test = await this.executeExerciseCommand(ssh, "i=0; while true; do ((i++)); sleep 1; done", potentialResponse);
                    console.log("Ma commande en carton pate", command_test);
                    
                    if (typeof command_test === 'object' && 'error' in command_test) return command_test;
                  } catch (err: any) {
                    console.log("Command execution error:", err);
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
                    let query_test = await this.executeExerciseQuery(mysql_connexion, "SELECT 2+2;", potentialResponse);
                    if ('error' in query_test) return query_test;
                  } catch (err: any) {
                    console.log("Query execution error:", err);

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
              }
          
              mysql_connexion.release();
              ssh.dispose();
            
            /** On va chercher tous nos tests en DB */
            /** On boucle sur nos tests en fonction de query ou command === false */

            
            //const command = await ssh.execCommand("ls -l");
            
            
            /** On valide les tests qui reviennent true, si la réponse qui revient contient error on retourne la réponse */

            /** Si tous les tests sont passés, les exercises sont fini, on retourne la réponse standard au front avec next et error à false */
            


            const exerciseResponse: IDefaultExerciseResponse = this.ExerciseResponse(
                false,
                "Fini",
                "",
                "",
                20,
                0,
                20
            );

            // On insère en DB Test Terminé

            return exerciseResponse;

        } catch (error) {
            console.log("error:", error);
        }
    }

    private async prepareExerciseResponse(exercice: IExerciseRO)
    { 
        const potentialResponse: IDefaultExerciseResponse = this.ExerciseResponse(
            false,
            exercice.name,
            exercice.description,
            exercice.clue,
            0, //Requête SQL
            5, //Requête SQL
            20 //Requête SQL
        );

        return potentialResponse
    }

    private async GetSSHConnexion(userId: number, body: IExerciseFullBody): Promise<NodeSSH | IDefaultExerciseResponse>
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

            const exerciseResponse: IDefaultExerciseResponse = this.ExerciseResponse(
                error,
                "SSH", //Requête SQL
                "Merci de me donner l'accès à votre serveur avec la clé suivante et de me fournir les informations de connexion associé:<br><code>ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDRFaGoDfJYqNHC3Qx1bfTp7D9Uvy42D+VRIneJ7npz47AvVt1ReEUVyKDDxBpIMIOw9LLbzO/2AH3r9TI8wAS0p/kjdkduZVGfjwS3QXNA5bd6VZ0SqV3f23DGSr7b+GnZGSn6TpNvnccv8I6orlz/FqFi/FaHmqPik6/txWxcUyZKN5hMYn4+F4s0aYVfoaTyjJyeEMUSrIQxhqjodRmLdb00mBR/DjXV3V2MmOb12XwpQl8rRbN9xKxSaAQHZd2Kqn0ALFRBBiM6bugzFgwqg2yvNoG2TmPFvwHNSTSYhrhcnujJ93EN3T3kZ0M3dSUtgDm+LZRWgUbWxbkxqipdqET7dRPYlrz9juV4GhWpv4TNcdyjkOKH5hqX+uZMeWFM9QIbjWK8DcExNqYiu5rnGGm2DFXQxVp03yfs2jU9M7/aF4zq9tB8LGjrUCvfGFlU07YAldCthPxVMb3C+icJ3bXvajKK3Z+fIimW5tSLtTLU6drZQXYT7cvVZ5rZ21QvxzF7HX8amcmOKqMi/MiUJukEzd3we/yeIpHRzrA3ApBeTheqeT8riDDfktB0g6djpbYKSHBMi0h62sDnEeldx0+gJkUP5cwKYffQnMm4f9m1F6IuNfNHg34F95XJNQHRfhLvwdgCSzI8nBIsPpjgrZrYpORoTKeSTht+Tf17kw==</code>", //Requête SQL
                "Le fichier où doit être copié la clé publique est le suivant: <code>/home/<votre_utilisateur>/.ssh/authorized_keys</code>", //Requête SQL
                0, //Requête SQL
                5, //Requête SQL
                20 //Requête SQL
            );

            return exerciseResponse
        }
    }

    private async getMysqlTunnelConnexion(ssh: NodeSSH, userId: number, body: IExerciseFullBody): Promise< mysql.PoolConnection | IDefaultExerciseResponse>
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

            const exerciseResponse: IDefaultExerciseResponse = this.ExerciseResponse(
                error,
                "SGBDR", //Requête SQL
                "La connexion à la base donnée 'rgpd' à échoué sur votre serveur", //Requête SQL
                false, //Requête SQL
                0, //Requête SQL
                5, //Requête SQL
                20 //Requête SQL
            );

            return exerciseResponse;
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
            console.log(command_test);
            
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
        totalPoints: number
      ): IDefaultExerciseResponse {

        const response: IDefaultExerciseResponse = {
          error: error,
          name: name,
          description: description,
          clue: clue,
          user_points: userPoints,
          exercise_points: exercisePoints,
          total_point: totalPoints
        };
      
        return response;
      }
}

