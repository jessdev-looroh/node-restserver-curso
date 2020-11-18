import express from "express";
import bcrypt from "bcrypt";
import Usuario from "../models/usuario.model";
import jwt from "jsonwebtoken";
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

//CONFIGURACIONES DE GOOGLE
async function verify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser: any = await verify(token).catch((err) => {
    return res.status(403).json({ ok: false, err });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message:
              "Usuario ya registro sin google, usar autenticación normal",
          },
        });
      } else {
        let token = jwt.sign({ usuario: usuarioDB }, `${process.env.SEED}`, {
          expiresIn: process.env.CADUCIDAD_TOKEN,
        });
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      // Si el usuario no existe / nuevo usuario
      let usuario = new Usuario({
        nombre: googleUser.nombre,
        email: googleUser.email,
        img: googleUser.img,
        google: true,
        password: "lmL (*w*) lmL",
      });

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        let token = jwt.sign({ usuario: usuarioDB }, `${process.env.SEED}`, {
          expiresIn: process.env.CADUCIDAD_TOKEN,
        });
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      });
    }
  });
  //   res.json({ usuario : googleUser });
});

app.post("/login", (req, res) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuarioDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos",
        },
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectos",
        },
      });
    }
    let token = jwt.sign({ usuario: usuarioDB }, `${process.env.SEED}`, {
      expiresIn: process.env.CADUCIDAD_TOKEN,
    });
    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

export = app;
