import Ajv, { JSONSchemaType } from "ajv";
import { IMetaUserInfoSSHCreate, IMetaUserInfoSGBDRCreate } from "./IMetaUserInfos";

const MetaUserInfoSSHCreateSchema: JSONSchemaType<IMetaUserInfoSSHCreate> = {
  type: "object",
  properties: {
    id_user: { type: "number" },
    type: { type: "string" },
    host: { type: "string" },
    port: { type: "number" },
    username: { type: "string" },
    password: {type: "string", default: null}
  },
  required: ["id_user", "type", "host", "username","port"],
  additionalProperties: false,
};

const MetaUserInfoSGBDRCreateSchema: JSONSchemaType<IMetaUserInfoSGBDRCreate> = {
    type: "object",
    properties: {
      id_user: { type: "number" },
      type: { type: "string" },
      host: { type: "string" },
      port: { type: "number" },
      username: { type: "string" },
      password: { type: "string" },
    },
    required: ["id_user", "type", "host", "username","port", "password"],
    additionalProperties: false,
  };



const ajv = new Ajv();
export const MetaUserInfoSSHCreateValidator = ajv.compile(MetaUserInfoSSHCreateSchema);
export const MetaUserInfoSGBDRCreateValidator = ajv.compile(MetaUserInfoSGBDRCreateSchema);
