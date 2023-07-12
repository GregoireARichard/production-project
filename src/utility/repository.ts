import { RowDataPacket } from "mysql2";
import { DB } from "./DB";
import IIsGroupExerciseActive from "../types/IIsGroupExerciseActive";
import { IDefaultExerciseResponse } from "../types/IDefaultExerciseResponse";
import { IExerciseBody } from "../types/IExerciseBody";
import { IExercise } from "../types/IExercise";
import { IAdminConnectionRequest } from "../types/IAdminConnectionRequest";
import bcrypt from "bcrypt";
import { IChangeExerciseGroupStateRequest } from "../types/IChangeExerciseGroupStateRequest";
import { IErrorExercise } from "../types/IErrorExercise";
import { IExerciseRO } from "../model/Exercise/IExercise";

const db = DB.Connection;
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
      console.log("getExercise: ", error);
      throw error;
    }
  }
const checkIfAdminAccountIsValidQuery = "SELECT email, password from admin limit 1;"
export async function checkIfAdminAccountIsValid(body: IAdminConnectionRequest): Promise<Boolean>{
    try {
        const getAdminDetails:any = await db.query<RowDataPacket[]>(checkIfAdminAccountIsValidQuery)
        const email = getAdminDetails[0][0].email
        const password = getAdminDetails[0][0].password
        const validPassword = await bcrypt.compare(body.password, password);
        if(body.email === email && validPassword){
            return true
        }
    } catch (error) {
        console.log("checkIfAdminAccountIsValid: ", error)
    }
    return false
}

export async function changeExerciseGroupStateRepository(body: IChangeExerciseGroupStateRequest): Promise<void>{
    const changeExerciseGroupStateQuery = `UPDATE exercise_group SET is_active= ${body.state} where name = '${body.name}'`
    try {
        await db.query<RowDataPacket[]>(changeExerciseGroupStateQuery)
    } catch (error) {
        console.log("changeExerciseGroupState: ", error)
    }
}

const getAdminQuery = "SELECT id FROM admin where email = ?"
export async function getAdmin(email: string): Promise<string | undefined> {
    try {
       const admin = await db.query<RowDataPacket[]>(getAdminQuery, email)
       return admin[0][0].id
    } catch (error) {
        console.log("getAdmin: ", error)
    }

}
const getResultsQuery = "SELECT u.full_name, ue.points FROM user_exercise AS ue JOIN user AS u ON ue.id_user = u.id ORDER BY u.full_name ASC;"
export async function getStudentsResults(): Promise<any> {
    try {
       const result = await db.query<RowDataPacket[]>(getResultsQuery)
       
       return result[0]
    } catch (error) {
        console.log("getStudentsResults: ", error)
    }

}

export async function insertOrUpdateExerciseResult(exercise: IExerciseRO, userId: number): Promise<void> {
    try {
      const selectQuery = `SELECT id_user FROM user_exercise WHERE id_user = ?`;
      const selectParams = [userId];

      const [checkuser] = await db.query<RowDataPacket[]>(selectQuery, selectParams);
      if (checkuser.length === 0) {
        // Si aucune ligne correspondante n'est trouvée, effectuer un INSERT
        const insertQuery = `INSERT INTO user_exercise (id_user, last_exercice_validate_id, points) VALUES (?, ?, ?)`;
        const insertParams = [userId, exercise.id, exercise.points ];
  
        await db.query<RowDataPacket[]>(insertQuery, insertParams);
      } else {
        // Si une ligne correspondante est trouvée, effectuer un UPDATE
        const updateQuery = `UPDATE user_exercise SET points =  ?, last_exercice_validate_id = ? WHERE id_user = ?`;
        const updateParams = [ exercise.points,exercise.id, userId];

        await db.query<RowDataPacket[]>(updateQuery, updateParams);
      }
  
    } catch (error) {
      console.log("error:", error);
      
    }
  }
