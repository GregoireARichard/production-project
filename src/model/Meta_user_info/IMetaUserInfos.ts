
export interface IMetaUserInfoSSH {
    id: number;
    id_user: number;
    group_id: number;
    type: string ;
    host: string;
    port: number ;
    username: string;
    password:string | null
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

  export type IMetaUserInfoSSHUpdate = Partial<IMetaUserInfoSSHCreate>;

 //SGBDR

  export type IMetaUserInfoSGBDRRO = Readonly<IMetaUserInfoSGBDR>;
  
  export type IMetaUserInfoSGBDRCreate = Omit<IMetaUserInfoSGBDR, 'id'>;

  export type IMetaUserInfoSGBDRUpdate = Partial<IMetaUserInfoSGBDRCreate>;
