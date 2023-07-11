export interface IPreviousExercises {
    exercises: IExerciseSubset[];
}

export interface IExerciseSubset {
    name: string;
    question_number: number;
    description: string;
    clue: string;
    points: number;
    group_id: number;
}