export interface IAdmin {
    id: number;
    email: string;
    password: string;
  }

export type IAdminRO = Readonly<IAdmin>;
