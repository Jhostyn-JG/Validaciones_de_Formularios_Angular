const express = require('express');
const router = express.Router();
const connection = require('../models/userModel');

router.post('/guardarUsuario', (req, res) => {
  const usuario = req.body;

  connection.query('INSERT INTO usuarios SET ?', usuario, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al guardar el usuario');
    } else {
      res.status(200).send('Usuario guardado con éxito');
    }
  });
});

module.exports = router;
