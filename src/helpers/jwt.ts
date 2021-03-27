import jwt from "jsonwebtoken";

export default class Token {
  private static seed: string = String(process.env.SEED);
  private static caducidad: string = "24h";

  constructor() {}

  static generateJwtToken(payload: any): Promise<string> {
    // jwt.sign({dataa colocar en el token(payload)}, seed/semillas(definir algo de forma unica del token),{fecha de exipracion del token})
    return new Promise((resolve, reject) => {
      jwt.sign({ usuario: payload }, this.seed, {
        expiresIn: this.caducidad,
      },(err,token) => {
          if (err) {
              reject(`ERROR ${err}`);
          } else {
              resolve(token!);
          }
      });
    });
  }

  static comprobarToken(userToken: string) {
    return new Promise((resolve, reject) => {
      // jwt.verify('token que recibe de la peticion', semillas, callback(err,decoded-informacion del usuario q se coloco en el payload ) )
      jwt.verify(userToken, this.seed, (err: any, decode: any) => {
        if (err) {
          // no confiar
          reject("token no valido");
        } else {
          // confiar token valido
          resolve(decode);
        }
      });
    });
  }
}
