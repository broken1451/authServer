import { Router, Request, Response } from "express";
import { check } from "express-validator";
import bcrypt from "bcrypt";
import { validarCampos } from "../middlewares/validarCampos";
import { UsuarioModel } from "../models/usuarioModel";
import Token from "../helpers/jwt";
import { verificaToken } from "../middlewares/validarToken";

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
      const userLogin = await UsuarioModel.findOne({email: email}).exec();
      if (userLogin) {
        if (userLogin.compararClave(password)) {
          const payload = {
            _id: userLogin._id,
            name: userLogin.name,
            email: userLogin.email,
          };
          const token = await Token.generateJwtToken(payload);
          return res.status(200).json({
            ok: true,
            userLogin,
            token,
          });
        } else if (password == '' || userLogin.password == ''){
          return res.status(400).json({
            ok: false,
            mensaje: 'Campo vacio',
            errors: { message: 'El campo no puede estar vacio' },
          });
        } else if (password !== userLogin.password) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Clave incorrecta',
            errors: { message: 'Clave incorrecta' },
          });
        }
      } else {
        return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales no son correctas',
          errors: { message: 'Credenciales no son correctas' },
        });
      }
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        ok: false,
        msg: "Ha ocurrido un error interno",
      });
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
      const token = await Token.generateJwtToken(usuario);
      await userCreated.save();
      return res.status(201).json({
        ok: true,
        message: "user guardado",
        uid: userCreated.id,
        userCreated,
        token,
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

// validar y renovar token
authRoutes.get("/renewtoken", verificaToken ,async (req: any, res: Response) => {
  try {
    const {usuario, uid, name} = req;
    const token = await Token.generateJwtToken(usuario);
    return res.status(200).json({
      ok: true,
      msg: "RE new token",
      usuario,
      token
    });
    
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error interno.",
    });
  }
});

export default authRoutes;
