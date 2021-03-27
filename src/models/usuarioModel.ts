import mongoose, {Model} from "mongoose";
import * as bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: [true, "El nombre es necesario y unico"] },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario y unico"],
  },
  password: { type: String, required: [true, 'La clave es necesaria'] },
  created: { type: Date, default: Date.now },
});

// Arrglear esto
// userSchema.method<User>("compararClave", function (password: string = ''): boolean {
userSchema.method("compararClave", function (password: string = ''): boolean {
  // "noImplicitThis": false, tsconfig
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
});

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  compararClave(password: string): boolean;
}

export const UsuarioModel = mongoose.model<User>("User", userSchema);
  