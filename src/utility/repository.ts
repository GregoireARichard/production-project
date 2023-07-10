import { RowDataPacket } from "mysql2";
import { DB } from "./DB";
import IIsGroupExerciseActive from "../types/IIsGroupExerciseActive";
import { IDefaultExerciseResponse } from "../types/IDefaultExerciseResponse";
import { IExerciseBody } from "../types/IExerciseBody";
import { IExercise } from "../types/IExercise";


const isExerciseActiveQuery = "SELECT is_active, name from exercise_group where id = ?"
export async function isGroupExerciseActive(groupId: number){
    const db = DB.Connection
    try {
        const exercise: IExercise  = await getExercises(groupId)
        const exerciceData = await db.query<RowDataPacket[]>(isExerciseActiveQuery, groupId);
        const isActiveBool: number = exerciceData[0][0].is_active
        const exerciseName = exerciceData[0][0].name
        if( isActiveBool === 0){
            const response: IDefaultExerciseResponse = {
                next: false,
                error: {
                    title: 'Unavailable',
                    message: 'Exercise turned off by admin',
                    status_code: 401
                },
                name: exerciseName,
                description: "Exercice arrêté par l'administrateur",
                clue: "",
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
export async function getExercises(groupId: number): Promise<IExercise> {
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