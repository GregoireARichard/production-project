import { RowDataPacket } from "mysql2";
import { DB } from "./DB";
import IIsGroupExerciseActive from "../types/IIsGroupExerciseActive";
import { IDefaultExerciseResponse } from "../types/IDefaultExerciseResponse";
import { IExerciseBody } from "../types/IExerciseBody";
import { IExercise } from "../types/IExercise";
import { IAdminConnectionRequest } from "../types/IAdminConnectionRequest";
import bcrypt from "bcrypt";
import { IChangeExerciseGroupStateRequest } from "../types/IChangeExerciseGroupStateRequest";


const db = DB.Connection;
const isExerciseActiveQuery = "SELECT is_active, name from exercise_group where id = ?"
export async function isGroupExerciseActive(groupId: number){

    try {
        const exercise: IExercise  = await getExercises(groupId)
        const exerciceData = await db.query<RowDataPacket[]>(isExerciseActiveQuery, groupId);
        const isActiveBool: number = exerciceData[0][0].is_active
        const exerciseName = exerciceData[0][0].name
        if(isActiveBool === 0){
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
    try {
      const getExercise = await db.query<RowDataPacket[]>(getExerciseQuery, groupId);
      const exercise = getExercise[0][0] as IExercise | undefined;
      if (exercise) {
        return exercise;
      } else {
        throw new Error("Exercise not found");
      }
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
       console.log(result[0]);
       
       return result[0]
    } catch (error) {
        console.log("getStudentsResults: ", error)
    }

}
