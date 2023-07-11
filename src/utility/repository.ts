import { RowDataPacket } from "mysql2";
import { DB } from "./DB";
import IIsGroupExerciseActive from "../types/IIsGroupExerciseActive";
import { IDefaultExerciseResponse } from "../types/IDefaultExerciseResponse";
import { IExerciseBody } from "../types/IExerciseBody";
import { IExercise } from "../types/IExercise";
import { IErrorExercise } from "../types/IErrorExercise";
import { IExerciseRO } from "../model/Exercise/IExercise";

const isExerciseActiveQuery = "SELECT is_active, name from exercise_group where id = ?"
const getExerciseQuery = "SELECT * FROM exercise WHERE group_id = ?"


export async function isGroupExerciseActive(groupId: number): Promise< boolean|IDefaultExerciseResponse > {
    try {
        const db = DB.Connection
        const exerciceData = await db.query<RowDataPacket[]>(isExerciseActiveQuery, groupId);
        const isActiveBool: number = exerciceData[0][0].is_active

        if( isActiveBool === 0) {
            throw new Error("Exercice arrêté par l'administrateur");
        }

        return true;
       
    } catch (err : any) {
        console.log("isGroupExerciseActive:", err)

        const error: IErrorExercise = {
          title: 'Unavailable',
          message: err.message || "Exercice arrêté par l'administrateur" ,
          status_code: 401
        }

        const response: IDefaultExerciseResponse = {
          error,
          name: "",
          description: "L'exercice est terminé !",
          clue: "",
          user_points: 0,
          exercise_points: 0,
          total_point: 0,
          passed: false
        }
     return response
    }
    
}


export async function getExercises(groupId: number): Promise<IExerciseRO[]> {
    try {
      const db = DB.Connection;
      const getExercise = await db.query<RowDataPacket[]>(getExerciseQuery, groupId);
      
      return getExercise[0] as any;

    } catch (error) {
      console.log("getExercise:", error);
      throw error;
    }
  }