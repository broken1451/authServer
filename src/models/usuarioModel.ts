import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "El nombre es necesario y unico"] },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario y unico"],
  },
  password: { type: String, required: [true, "La clave es necesaria"] },
  created: { type: Date, default: Date.now },
});

interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

export const UsuarioModel = mongoose.model<User>("User", userSchema);
