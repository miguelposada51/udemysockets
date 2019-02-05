"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var server_1 = __importDefault(require("../classes/server"));
var socket_1 = require("../sockets/socket");
var router = express_1.Router();
router.get('/mensajes', function (req, res) {
    res.json({
        ok: true,
        mensaje: 'Hola soy luci!!'
    });
});
router.post('/mensajes', function (req, res) {
    var cuerpo = req.body.cuerpo;
    var de = req.body.de;
    var payload = {
        de: de,
        cuerpo: cuerpo
    };
    var server = server_1.default.instance;
    server.io.emit('mensaje-nuevo', payload);
    res.json({
        ok: true,
        cuerpo: cuerpo,
        de: de
    });
});
// obtener los ids de los usuarios
router.post('/mensajes/:id', function (req, res) {
    var cuerpo = req.body.cuerpo;
    var de = req.body.de;
    var id = req.params.id;
    var payload = {
        de: de,
        cuerpo: cuerpo
    };
    var server = server_1.default.instance;
    server.io.in(id).emit('mensaje-privado', payload);
    res.json({
        ok: true,
        cuerpo: cuerpo,
        de: de,
        id: id
    });
});
router.get('/usuarios', function (req, res) {
    var server = server_1.default.instance;
    server.io.clients(function (err, clientes) {
        if (err) {
            res.json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            clientes: clientes
        });
    });
});
// obtener usuarios nuevamente y sus nombres
router.get('/usuarios/detalle', function (req, res) {
    res.json({
        ok: true,
        clientes: socket_1.usuariosConectados.getLista()
    });
});
exports.default = router;
