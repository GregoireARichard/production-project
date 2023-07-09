export interface IExerciseGroup {
    id: number;
    is_active: boolean;
    name: string;
  }
  
  export type IExerciseGroupRO = Readonly<IExerciseGroup>;
  
  export type IExerciseGroupCreate = Omit<IExerciseGroup, 'id'>;
  
  export type IExerciseGroupUpdate = Partial<IExerciseGroupCreate>;