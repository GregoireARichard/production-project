import Ajv, { JSONSchemaType } from "ajv";
import { IUserCreate, IUserUpdate } from "./IUser";

const UserCreateSchema : JSONSchemaType<IUserCreate> = {
  type: "object",
  properties: {
    email: { type: 'string' },  
    fullname: { type: 'string' },  
  },
  required: ["email"],
  additionalProperties: false,
};

const UserUpdateSchema : JSONSchemaType<IUserUpdate> = {
  type: "object",
  properties: {
    email: { type: 'string', nullable: true },  
    fullname: { type: 'string', nullable: true }, 
  },  
  additionalProperties: false,
};

const ajv = new Ajv();
export const UserCreateValidator = ajv.compile(UserCreateSchema);
export const UserUpdateValidator = ajv.compile(UserUpdateSchema);