import Ajv, { JSONSchemaType } from "ajv";
import { IUserExerciseCreate, IUserExerciseUpdate } from "./IUserExercise";

const UserExerciseCreateSchema: JSONSchemaType<IUserExerciseCreate> = {
  type: "object",
  properties: {
    id_user: { type: "number" },
    last_exercice_validate_id: { type: "number" },
    points: { type: "number" },
  },
  required: ["id_user", "last_exercice_validate_id", "points"],
  additionalProperties: false,
};

const UserExerciseUpdateSchema: JSONSchemaType<IUserExerciseUpdate> = {
  type: "object",
  properties: {
    id_user: { type: "number", nullable: true },
    last_exercice_validate_id: { type: "number", nullable: true },
    points: { type: "number", nullable: true },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
export const UserExerciseCreateValidator = ajv.compile(UserExerciseCreateSchema);
export const UserExerciseUpdateValidator = ajv.compile(UserExerciseUpdateSchema);