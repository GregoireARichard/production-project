import { Body, Post, Route, Security } from "tsoa";
import { changeExerciseGroupStateRepository } from "../../utility/repository";
import { IChangeExerciseGroupStateRequest } from "../../types/IChangeExerciseGroupStateRequest";

@Route("admin")
@Security("JWTADMIN")
export class adminManagementController{
    @Post("/exercise")
    public async changeExerciseGroupState(@Body() body: IChangeExerciseGroupStateRequest): Promise<void>{
        await changeExerciseGroupStateRepository(body)
    }
}
