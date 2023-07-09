export interface IExercise {
    id: number;
    question_number: number ;
    name: string;
    description: string ;
    clue: string ;
    command: string ;
    query: string ;
    group_id: number ;
  }
  
  export type IExerciseRO = Readonly<IExercise>;
  
  export type IExerciseCreate = Omit<IExercise, 'id'>;
  
//   export type IExerciseUpdate = Partial<IExerciseCreate>;