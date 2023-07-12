// Définition d'un structure IUser
// A noter, le ? veut dire que le champ est optionnel

export interface IUserGroupID {
  id: number;
  email: string;
  full_name: string;
  group_id: number
}

// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs

export type IUser = Omit<IUserGroupID, 'group_id'>;

export type IUserRO = Readonly<IUser>;

export type IUserCreate = Omit<IUser, 'id'>;

export type IUserUpdate = Partial<IUserCreate>;