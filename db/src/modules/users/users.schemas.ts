// JSON Schema único para validar body y mostrar en Swagger
export const UserSchema = {
  type: "object",
  required: ["Username", "Email", "Password"],
  properties: {
    Id: { type: "integer" },
    Username: { type: "string" },
    Email: { type: "string" },
    Password: { type: "string" },
    Nickname: { type: "string" },
    Avatar: { type: "string" }, // base64 o URL
    Created_At: { type: "string", format: "date-time" },
    Updated_At: { type: "string", format: "date-time" },
  },
};
