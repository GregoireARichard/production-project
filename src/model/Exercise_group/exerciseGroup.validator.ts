import Ajv, { JSONSchemaType } from "ajv";
import { IExerciseGroupCreate, IExerciseGroupUpdate } from "./IExerciseGroup";

const ExerciseGroupCreateSchema: JSONSchemaType<IExerciseGroupCreate> = {
  type: "object",
  properties: {
    is_active: { type: "boolean" },
    name: { type: "string" },
  },
  required: ["is_active", "name"],
  additionalProperties: false,
};

const ExerciseGroupUpdateSchema: JSONSchemaType<IExerciseGroupUpdate> = {
  type: "object",
  properties: {
    is_active: { type: "boolean", nullable: true },
    name: { type: "string", nullable: true },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
export const ExerciseGroupCreateValidator = ajv.compile(ExerciseGroupCreateSchema);
export const ExerciseGroupUpdateValidator = ajv.compile(ExerciseGroupUpdateSchema);