import { Client } from 'node-mailjet';


export class Email {

  private client: Client;
  
  constructor() {
    this.client = new Client({
      apiKey: process.env.MJ_APIKEY ||  '8393ce65a494a4d005d151393ea5c859',
      apiSecret: process.env.MJ_APISECRET || '52abdfb9c873ac741c81ee2560ea12ac'
    });
  }

  async sendMagicLink(to: string, link: string, title: string) {
    console.info('Sending magic link to: ' + to);
    const request = await this.client
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": process.env.MJ_EMAIL_FROM || 'gregoire.richard86@gmail.com',
              "Name": process.env.MJ_EMAIL_NAME || 'Kevin'
            },
            "To": [
              {
                "Email": to,
              }
            ],
            "Subject": title.toUpperCase() + " : Votre lien magique",
            "HTMLPart": `
<p>Bonjour,</p>
<p>Cliquez sur le lien afin de vous identifier. Le lien sera valable pendant 30 minutes.</p>
<p><a href=" + ${link} + ">Connexion</a>
<p>Si le lien dessus ne fonctionne pas, copiez/collez le lien suivant dans votre navigateur :</a>
<pre>${link}</pre>
`,
          }
        ]
      });
  }

}