import { Router } from "express";
import { ApiError } from "../../utility/Error/ApiError";
import { ErrorCode } from "../../utility/Error/ErrorCode";
import { Get, Query, Route, Security } from 'tsoa';
import {SSH} from '../../utility/SSH';

const router = Router({ mergeParams: true });

@Route("/production")
@Security('jwt')
export class ProductionController{
    @Get("/ssh")
    public async ProdController_sshConnexion()
    {
        try {
            // On récupère l'id de l'utilisateur dans le jwt
            // On parse le body pour chercher le host:username:port si body vide, on regarde en BDD
            // Si on à les infos, on teste la connexion ssh
            // Si connexion ssh on teste connexion à la BDD distante
            // Si connexion à la BDD distante
    
            const ssh = await SSH.getSSHConnexion({
                host: '193.70.84.157',
                username: 'ubuntu',
                port: 22
            })

            if(!ssh) {
                throw new ApiError(500, "ssh/connexion failed", "SSH connection failed");
            }

            const command = await ssh.execCommand("toto");

            return {"stdout": command.stdout, "stderr": command.stderr};
            

        } catch (error) {
            console.log(error);
        }
    }

    
    
}

