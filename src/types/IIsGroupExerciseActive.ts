import { RowDataPacket } from "mysql2";

export default interface IIsGroupExerciseActive extends RowDataPacket{
    is_active : number
}