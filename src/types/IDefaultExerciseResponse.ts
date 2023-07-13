import { IErrorExercise } from "./IErrorExercise";
import { IPreviousExercises } from "./IPreviousExercises";

export interface IDefaultExerciseResponse {
    error: IErrorExercise | false,
    name: string,
    description: string,
    clue: string | false,
    user_points: number,
    exercise_points: number,
    question_number: number;
    total_point: number
    passed: IPreviousExercises | false
}