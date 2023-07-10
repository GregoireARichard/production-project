export interface IExerciseBody {
    name: string,
    group_id: number;
    test: {
        host: string,
        username: string,
        password: string | undefined,
        port: number
    }
}