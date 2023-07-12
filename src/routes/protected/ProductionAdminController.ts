import { Body, Get, Post, Query, Route, Security } from "tsoa";
import { changeExerciseGroupStateRepository, getAllExerciseGroups, getStudentsResults, insertExerciseGroup } from "../../utility/repository";
import { IChangeExerciseGroupStateRequest } from "../../types/IChangeExerciseGroupStateRequest";
import { IStudentsResults } from "../../types/IStudentsResults";
import { IExercisesGroup } from "../../types/IExercicesGroup";
import { ApiError } from "../../utility/Error/ApiError";
import { ErrorCode } from "../../utility/Error/ErrorCode";
import { IInsertNewExerciseGroup } from "../../types/IInsertNewExerciseGroup";

@Route("admin")
@Security("JWTADMIN")
export class adminManagementController{
    @Get("/exercise_list")
    public async getAllExercises(): Promise<IExercisesGroup[]>{
       const resultsFromQuery = await getAllExerciseGroups()
       return resultsFromQuery as IExercisesGroup[]
    }
    @Post("/exercise")
    public async changeExerciseGroupState(@Body() body: IChangeExerciseGroupStateRequest): Promise<void | ApiError>{
       const result =  await changeExerciseGroupStateRepository(body)
       if (result == "Record not found"){
            throw new ApiError(ErrorCode.NotFound, 'sql/not-found', 'No records found')
       }
    }

    @Get("/results")
    public async GetStudentsResults(): Promise<IStudentsResults[]>{
        return await getStudentsResults()
    }
    @Post("/add_exercise_group")
    public async addExerciseGroup(@Body() body: IInsertNewExerciseGroup): Promise<void>{
        if ((body.name).length === 0){
            throw new ApiError(ErrorCode.BadRequest, 'sql/failed', 'Le nom ne peut être vide')
        }
        await insertExerciseGroup(body.name)
    }

}
