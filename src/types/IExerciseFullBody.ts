export interface IExerciseFullBody {
    id_student: number;
    name: string;
    group_id: number;
    test: {
        host: string;
        username: string;
        password: string;
        port: number;
    }
}