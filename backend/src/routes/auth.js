const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


const router = express.Router();

/* REGISTRO */
router.post("/register", async (req, res) => {

  try {

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    // Verificar si existe
    const existe = await User.findOne({ email });

    if (existe) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Encriptar
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      nombre,
      email,
      password: hash
    });

    await nuevoUsuario.save();

    res.json({ msg: "Usuario creado correctamente ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en servidor" });
  }

});

/* LOGIN */
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // Verificar campos
    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan datos" });
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no existe" });
    }

    // Comparar password
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role || "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login correcto ✅",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role || "user"
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en servidor" });
  }

});

module.exports = router;
