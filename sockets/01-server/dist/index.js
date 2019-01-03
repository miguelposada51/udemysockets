"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./classes/server"));
var server = new server_1.default();
server.start(function () {
    console.log("Sevidor corriendo en el puerto " + server.port + "}");
});
