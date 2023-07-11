export interface IExercise {
    id: number,
    name: string,
    description: string,
    command: string;
    query: string;
    expected: string,
    clue: string,
    points: number,
    group_id: number
}