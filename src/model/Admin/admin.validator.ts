// import Ajv, { JSONSchemaType } from "ajv";
// import { IAdminCreate, IAdminUpdate } from "./IAdmin";

// const AdminCreateSchema: JSONSchemaType<IAdminCreate> = {
//     type: "object",
//     properties: {
//       email: { type: "string" },
//       password: { type: "string" },
//     },
//     required: ["email", "password"],
//     additionalProperties: false,
//   };
  
//   const AdminUpdateSchema: JSONSchemaType<IAdminUpdate> = {
//     type: "object",
//     properties: {
//       email: { type: "string", nullable: true },
//       password: { type: "string", nullable: true },
//     },
//     additionalProperties: false,
//   };
  
//   const ajv = new Ajv();
//   export const AdminCreateValidator = ajv.compile(AdminCreateSchema);
//   export const AdminUpdateValidator = ajv.compile(AdminUpdateSchema);