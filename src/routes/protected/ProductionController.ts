import { Router } from "express";
import { ApiError } from "../../utility/Error/ApiError";
import { ErrorCode } from "../../utility/Error/ErrorCode";
import { Body, Post, Get, Query, Route, Security, Request } from 'tsoa';
import {SSH} from '../../utility/SSH';
import { Crud } from '../../utility/Crud';
import { DB } from "../../utility/DB";
import { RowDataPacket } from "mysql2";
import mysql, { Pool } from 'mysql2/promise';
import { NodeSSH } from "node-ssh";


const router = Router({ mergeParams: true });

@Route("/production")
@Security('jwt')
export class ProductionController{

    @Post("/ssh")
    public async ProdController_sshConnexion(@Body() body: any, @Request() request: any)
    {
        try {
            // On récupère l'id de l'utilisateur dans le jwt
            // On parse le body pour chercher le host:username:port si body vide, on regarde en BDD
            // Si on à les infos, on teste la connexion ssh
            // Si connexion ssh on teste connexion à la BDD distante
            // Si connexion à la BDD distante
            const { userId } =  request.user;

            const db = DB.Connection;
            //fonction SSHConnectionTunel à deplacer dans la classe 
            async function SSHConnectionTunel(userId: string, body: any): Promise<false|NodeSSH> {
              
                if (body.name === "ssh") {
                  const isMetaSSH = await db.query<RowDataPacket[]>(`select COUNT(*) as nb_rows from meta_user_info where id_user = ? AND type='ssh'`, [userId]);
              
                  if (isMetaSSH[0][0].nb_rows === 0) {
                    try {
                      const data = { id_user: userId, type: body.name, host: body.test.host, username: body.test.username, port: body.test?.port || 22 };
                      await db.query<RowDataPacket[]>(`insert into meta_user_info set ?`, data);
                    } catch (error) {
                      console.log(error);
                      throw new ApiError(ErrorCode.BadRequest, 'validation/failed', `probably missing informations`);
                    }
                  }
                }
              
                const ssh_meta_result = await db.query<RowDataPacket[]>(`select * from meta_user_info where id_user = ? AND type='ssh'`, [userId]);
                const ssh_meta = ssh_meta_result[0][0];
              
                const ssh = await SSH.getSSHConnexion({
                  host: ssh_meta.host,
                  username: ssh_meta.username,
                  port: ssh_meta.port || 22
                });
              
                return ssh ;
              }
              

            const ssh = await SSHConnectionTunel(userId,body)

            if(!ssh) {
                throw new ApiError(500, "ssh/connexion failed", "SSH connection failed");
            }
            //fonction createMySQLPool à deplacer dans la classe 
            async function createMySQLPool(userId: string, body: any): Promise<mysql.Pool> {
                if (body.name === "mysql") {
                  const isMetaDb = await db.query<RowDataPacket[]>(`select COUNT(*) as nb_rows from meta_user_info where id_user = ? AND type='mysql'`, [userId]);
                  console.log(isMetaDb[0][0].nb_rows);
                              
                  if (isMetaDb[0][0].nb_rows === 0) {
                    try {
                      const data = {
                        id_user: userId,
                        type: body.name,
                        host: body.test?.host || "localhost",
                        username: body.test.username,
                        password: body.test.password,
                        port: body.test?.port || 3306
                      };
                      await db.query<RowDataPacket[]>(`insert into meta_user_info set ?`, data);
                    } catch (error) {
                      console.log(error);
                      throw new ApiError(ErrorCode.BadRequest, 'validation/failed', `probably missing informations`);
                    }
                  }
                }
              
                const mysql_meta_result = await db.query<RowDataPacket[]>(`select * from meta_user_info where id_user = ? AND type='mysql'`, [userId]);
                const mysql_meta = mysql_meta_result[0][0];
              
                const sshTunnel = await SSH.SSHTunnel(
                  ssh as NodeSSH,
                  '127.0.0.1',
                  3306,
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
              
                return mysql_pool;
              }
              //appel de la fonction createMySQLPool
              const mysql_pool = await createMySQLPool(userId,body)
              
              
              const mysql_connexion = await mysql_pool.getConnection();
              
              const result_query = await mysql_connexion.query("SHOW TABLES;");
              
              console.log(result_query[0]);
            
            const command = await ssh.execCommand("ls -l");
            
            mysql_connexion.release();
            ssh.dispose();

            return {"stdout": command.stdout, "stderr": command.stderr};

        } catch (error) {
            console.log(error);
        }
    }

}

