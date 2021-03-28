"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaToken = void 0;
var jwt_1 = __importDefault(require("../helpers/jwt"));
var verificaToken = function (req, res, next) {
    // token enviado por los headers
    var userToken = req.header("x-token") || "";
    // const userToken = req.get("x-token") || "";
    jwt_1.default.comprobarToken(userToken)
        .then(function (decoded) {
        // console.log({ decoded });
        req.usuario = decoded.usuario;
        next();
    })
        .catch(function (err) {
        return res.status(401).json({
            ok: false,
            mensaje: "token no valido",
        });
    });
};
exports.verificaToken = verificaToken;
