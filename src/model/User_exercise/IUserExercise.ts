export interface IUserExercise {
    id: number;
    id_user: number;
    last_exercice_validate_id: number;
    points: number;
  }
  
  export type IUserExerciseRO = Readonly<IUserExercise>;
  
  export type IUserExerciseCreate = Omit<IUserExercise, 'id'>;
  
  export type IUserExerciseUpdate = Partial<IUserExerciseCreate>;