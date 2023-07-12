export interface IExerciseBody {
    name?: string;
    test?: {
        host: string;
        username: string;
        password?: string;
        port: number;
    }
}