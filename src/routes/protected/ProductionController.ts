import { Router } from "express";
import { ApiError } from "../../utility/Error/ApiError";
import { ErrorCode } from "../../utility/Error/ErrorCode";
import { Body, Post, Get, Query, Route, Security, Request } from 'tsoa';
import {SSH} from '../../utility/SSH';

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
            
            const ssh = await SSH.getSSHConnexion({
                host: body.host,
                username: body.username,
                port: body?.port || 22
            })

            if(!ssh) {
                throw new ApiError(500, "ssh/connexion failed", "SSH connection failed");
            }

            const command = await ssh.execCommand("ls -l");

            return {"stdout": command.stdout, "stderr": command.stderr};
            

        } catch (error) {
            console.log(error);
        }
    }

    
    
}

