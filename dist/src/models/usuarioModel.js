"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var bcrypt = __importStar(require("bcrypt"));
var userSchema = new mongoose_1.default.Schema({
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
userSchema.method("compararClave", function (password) {
    if (password === void 0) { password = ''; }
    // "noImplicitThis": false, tsconfig
    if (bcrypt.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.UsuarioModel = mongoose_1.default.model("User", userSchema);
