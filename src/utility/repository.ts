import { RowDataPacket } from "mysql2";
import { DB } from "./DB";
import IIsGroupExerciseActive from "../types/IIsGroupExerciseActive";
import { IDefaultExerciseResponse } from "../types/IDefaultExerciseResponse";
import { IExerciseBody } from "../types/IExerciseBody";
import { IExercise } from "../types/IExercise";


const isExerciseActiveQuery = "SELECT eg.is_active FROM exercise e JOIN exercise_group eg ON e.group_id = eg.id WHERE e.group_id = ?"
export async function isGroupExerciseActive(groupId: number){
    const db = DB.Connection
    try {
        const exercise: IExercise  = await getExercise(groupId)
        const isExerciceActive = await db.query<RowDataPacket[]>(isExerciseActiveQuery, groupId);
        const isActiveBool: number = isExerciceActive[0][0].is_active
        if( isActiveBool === 0){
            const response: IDefaultExerciseResponse = {
                next: false,
                error: {
                    title: 'Unavailable',
                    message: 'Exercise turned off by admin',
                    status_code: 401
                },
                name: exercise.name,
                description: exercise.description,
                clue: exercise.clue,
                user_points: 0,
                exercise_points: 0,
                total_point: 0
           }
           return response
        }
       
    } catch (error) {
        console.log("isGroupExerciseActive:", error)
    }
    
}

const getExerciseQuery = "SELECT * FROM exercise WHERE group_id = ?"
export async function getExercise(groupId: number): Promise<IExercise> {
    const db = DB.Connection;
    try {
      const getExercise = await db.query<RowDataPacket[]>(getExerciseQuery, groupId);
      const exercise = getExercise[0][0] as IExercise | undefined;
      if (exercise) {
        return exercise;
      } else {
        throw new Error("Exercise not found");
      }
    } catch (error) {
      console.log("getExercise:", error);
      throw error;
    }
  }