import { NodeSSH } from 'node-ssh'
import { ErrorCode } from './Error/ErrorCode';
import { SSH2Stream } from 'ssh2-streams';
import { Client, ConnectConfig, Channel } from 'ssh2';
import mysql, { Pool } from 'mysql2/promise';


export class SSH {

    public static async getSSHConnexion(params: {
        host: string,
        username: string,
        port: number
    }): Promise<false | NodeSSH>
    {
        const ssh = new NodeSSH();
    
        await ssh.connect({
            host: params.host,
            username: params.username,
            port: params.port,
            privateKeyPath: process.env.RSA_PRIVATE_KEY ||'/home/dev/secrets/signing/ovh_vps'
        })

        if (ssh.isConnected()) {
            return ssh;
        }
        return false;

    }

    public async execCommand(ssh: NodeSSH, cmd: string)
    {
        const result = await ssh.execCommand(cmd);
        return { result: result.stdout };
    }

    public static async SSHTunnel(ssh: NodeSSH, localhost: string, localport: number, remotehost: string, remoteport: number): Promise<Channel> {
        return new Promise<Channel>((resolve, reject) => {
          ssh.forwardOut(localhost, localport, remotehost, remoteport)
            .then(async (stream: Channel) => {
              resolve(stream);
            })
            .catch((err: Error) => {
              reject(err);
            });
        });
    }
    
}