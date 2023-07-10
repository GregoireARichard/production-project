
export interface IMetaUserInfoSSH {
    id: number;
    id_user: number;
    group_id: number;
    type: string ;
    host: string;
    port: number ;
    username: string;
  }
  export interface IMetaUserInfoSGBDR {
    id: number;
    id_user: number;
    group_id: number;
    type: string ;
    host: string;
    port: number ;
    username: string;
    password: string | null ;
  }

  //SSH
  export type IMetaUserInfoSSHRO = Readonly<IMetaUserInfoSSH>;
  
  export type IMetaUserInfoSSHCreate = Omit<IMetaUserInfoSSH, 'id'>;

 //SGBDR

  export type IMetaUserInfoSGBDRRO = Readonly<IMetaUserInfoSGBDR>;
  
  export type IMetaUserInfoSGBDRCreate = Omit<IMetaUserInfoSGBDR, 'id'>;
