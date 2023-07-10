export interface IExercise {
    id: number;
    question_number: number ;
    expected: string;
    name: string;
    description: string ;
    clue: string ;
    command: string ;
    query: string ;
    points: number;
    group_id: number ;
  }
  
  export type IExerciseRO = Readonly<IExercise>;
  
  export type IExerciseCreate = Omit<IExercise, 'id'>;
  