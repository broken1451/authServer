import { Router, Request, Response } from "express";
import { check } from "express-validator";
import bcrypt from "bcrypt";
import { validarCampos } from "../middlewares/validarCampos";
import { UsuarioModel } from "../models/usuarioModel";

const authRoutes = Router();

authRoutes.get("/test", async (req: any, res: Response) => {
  return res.status(200).json({
    ok: true,
  });
});

//login
authRoutes.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check(
      "password",
      "El password es obligatorio y debe ser al menos 6 caracteres"
    ).isLength({ min: 6 }),
    validarCampos,
  ],
  async (req: any, res: Response) => {
    try {
      const { email, password } = req.body;
      return res.status(200).json({
        ok: true,
        msg: "login",
      });
    } catch (error) {
      console.log({ error });
    }
  }
);

// nuevo user
authRoutes.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check(
      "password",
      "El password es obligatorio y debe ser al menos 6 caracteres"
    ).isLength({ min: 6 }),
    validarCampos,
  ],
  async (req: any, res: Response) => {
    try {
      const { name, email, password } = req.body;

      // verificar si no existe un correo igual
      const user = await UsuarioModel.findOne({ email: email }).exec();
      if (user) {
        return res.status(400).json({
          ok: false,
          msg: "El usuario ya existe con ese correo",
        });
      }

      // crear usuario
      const salt = bcrypt.genSaltSync();
      const usuario = {
        name,
        email,
        password: bcrypt.hashSync(password, salt),
      };
      const userCreated = new UsuarioModel(usuario);
      // genererar token

      await userCreated.save();
      return res.status(201).json({
        ok: true,
        message: "user guardado",
        uid: userCreated.id,
        userCreated,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        ok: false,
        msg: "Ha ocurrido un error interno.",
      });
    }
  }
);

// validar  revalidar token
authRoutes.get("/renewtoken", async (req: any, res: Response) => {
  return res.status(200).json({
    ok: true,
    msg: "RE new token",
  });
});

export default authRoutes;
