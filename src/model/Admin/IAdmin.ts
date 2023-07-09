export interface IAdmin {
    id: number;
    email: string;
    password: string;
  }

export type IAdminRO = Readonly<IAdmin>;

// export type IAdminCreate = Omit<IAdmin, 'id'>;

// export type IAdminUpdate = Partial<IAdminCreate>;