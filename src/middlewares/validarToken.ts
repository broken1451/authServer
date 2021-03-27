import Token from "../helpers/jwt";
import { NextFunction, Response, Request } from "express";

export const verificaToken = (req: any, res: Response, next: NextFunction) => {
  // token enviado por los headers
  const userToken = req.header("x-token") || "";
  // const userToken = req.get("x-token") || "";

  Token.comprobarToken(userToken)
    .then((decoded: any) => {
      console.log({ decoded });
      req.usuario = decoded.usuario;
      next();
    })
    .catch((err) => {
      return res.status(401).json({
        ok: false,
        mensaje: "token no valido",
      });
    });
};
