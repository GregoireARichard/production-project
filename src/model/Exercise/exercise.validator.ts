import Ajv, { JSONSchemaType } from "ajv";
import { IExerciseCreate } from "./IExercise";

const ExerciseCreateSchema: JSONSchemaType<IExerciseCreate> = {
  type: "object",
  properties: {
    question_number: { type: "number",  },
    name: { type: "string" },
    description: { type: "string",  },
    clue: { type: "string",  },
    command: { type: "string",  },
    query: { type: "string",  },
    group_id: { type: "number",  },
  },
  required: [],
  additionalProperties: false,
};

// const ExerciseUpdateSchema: JSONSchemaType<IExerciseUpdate> = {
//   type: "object",
//   properties: {
//     question_number: { type: "number",  nullable: true },
//     name: { type: "string", nullable: true },
//     description: { type: "string",  nullable: true },
//     clue: { type: "string",  nullable: true },
//     command: { type: "string",  nullable: true },
//     query: { type: "string",  nullable: true },
//     group_id: { type: "number",  nullable: true },
//   },
//   additionalProperties: false,
// };

const ajv = new Ajv();
export const ExerciseCreateValidator = ajv.compile(ExerciseCreateSchema);
// export const ExerciseUpdateValidator = ajv.compile(ExerciseUpdateSchema);