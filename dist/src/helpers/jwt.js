"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Token = /** @class */ (function () {
    function Token() {
    }
    Token.generateJwtToken = function (payload) {
        var _this = this;
        // jwt.sign({dataa colocar en el token(payload)}, seed/semillas(definir algo de forma unica del token),{fecha de exipracion del token})
        return new Promise(function (resolve, reject) {
            jsonwebtoken_1.default.sign({ usuario: payload }, _this.seed, {
                expiresIn: _this.caducidad,
            }, function (err, token) {
                if (err) {
                    reject("ERROR " + err);
                }
                else {
                    resolve(token);
                }
            });
        });
    };
    Token.comprobarToken = function (userToken) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // jwt.verify('token que recibe de la peticion', semillas, callback(err,decoded-informacion del usuario q se coloco en el payload ) )
            jsonwebtoken_1.default.verify(userToken, _this.seed, function (err, decode) {
                if (err) {
                    // no confiar
                    reject("token no valido");
                }
                else {
                    // confiar token valido
                    resolve(decode);
                }
            });
        });
    };
    Token.seed = String(process.env.SEED);
    Token.caducidad = "24h";
    return Token;
}());
exports.default = Token;
