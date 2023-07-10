import Ajv, { JSONSchemaType } from "ajv";
import { IMetaUserInfoSSHCreate, IMetaUserInfoSGBDRCreate } from "./IMetaUserInfos";

const MetaUserInfoSSHCreateSchema: JSONSchemaType<IMetaUserInfoSSHCreate> = {
  type: "object",
  properties: {
    id_user: { type: "number" },
    group_id: { type: "number" },
    type: { type: "string" },
    host: { type: "string" },
    port: { type: "number" },
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["id_user", "type", "host", "username","port", "group_id"],
  additionalProperties: false,
};

const MetaUserInfoSGBDRCreateSchema: JSONSchemaType<IMetaUserInfoSGBDRCreate> = {
    type: "object",
    properties: {
      id_user: { type: "number" },
      group_id: { type: "number" },
      type: { type: "string" },
      host: { type: "string" },
      port: { type: "number" },
      username: { type: "string" },
      password: { type: "string" },
    },
    required: ["id_user", "type", "host", "username","port", "password","group_id"],
    additionalProperties: false,
  };



const ajv = new Ajv();
export const MetaUserInfoSSHCreateValidator = ajv.compile(MetaUserInfoSSHCreateSchema);
export const MetaUserInfoSGBDRCreateValidator = ajv.compile(MetaUserInfoSGBDRCreateSchema);
