import { Body, Get, Post, Route, Security } from "tsoa";
import { changeExerciseGroupStateRepository, getStudentsResults } from "../../utility/repository";
import { IChangeExerciseGroupStateRequest } from "../../types/IChangeExerciseGroupStateRequest";
import { IStudentsResults } from "../../types/IStudentsResults";

@Route("admin")
@Security("JWTADMIN")
export class adminManagementController{
    @Post("/exercise")
    public async changeExerciseGroupState(@Body() body: IChangeExerciseGroupStateRequest): Promise<void>{
        await changeExerciseGroupStateRepository(body)
    }

    @Get("/results")
    public async GetStudentsResults(): Promise<IStudentsResults[]>{
        return await getStudentsResults()
    }

}
