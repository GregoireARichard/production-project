import Ajv, { JSONSchemaType } from "ajv";
import { IExerciseCreate } from "./IExercise";

const ExerciseCreateSchema: JSONSchemaType<IExerciseCreate> = {
  type: "object",
  properties: {
    question_number: { type: "number" },
    name: { type: "string" },
    description: { type: "string" },
    clue: { type: "string" },
    command: { type: "string" },
    query: { type: "string" },
    group_id: { type: "number" },
    expected: { type: "string" },
    points: { type: "number" }
  },
  required: [],
  additionalProperties: false,
};


const ajv = new Ajv();
export const ExerciseCreateValidator = ajv.compile(ExerciseCreateSchema);
