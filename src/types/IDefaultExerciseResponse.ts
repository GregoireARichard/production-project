import { IErrorExercise } from "./IErrorExercise";

export interface IDefaultExerciseResponse {
    error: IErrorExercise | false,
    name: string,
    description: string,
    clue: string | false,
    user_points: number,
    exercise_points: number,
    total_point: number
}