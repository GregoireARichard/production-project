import { NodeSSH } from 'node-ssh'
import { ErrorCode } from './Error/ErrorCode';
import { SSH2Stream } from 'ssh2-streams';

export class SSH {

    public static async getSSHConnexion(params: {
        host: string,
        username: string,
        port?: number
    }): Promise<false | NodeSSH>
    {
        const ssh = new NodeSSH();
    
        await ssh.connect({
            host: params?.host,
            username: params?.username,
            port: params?.port,
            privateKeyPath: '/home/dev/secrets/signing/ovh_vps'
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
    
}