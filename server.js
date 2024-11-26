//Importar FileSystem
const fs = require("fs");
const nomArchivo = "canciones.json";

// Importar express
const express = require('express');
const app = express();

//Importar cors
const cors = require("cors");
const path = require('path');
app.use(express.json());
app.use(cors());

// Obtenemos y consultamos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get("/canciones", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync("canciones.json"));
    res.status(200).json(canciones);
  });  

//Insertamos canciones  
app.post("/canciones", (req, res) => {
    const { id, titulo, artista, tono } = req.body;  

    //1.- leer el canciones.json y parsear
  const canciones = JSON.parse(fs.readFileSync("canciones.json"));
  const searchCancion = canciones.find((c) => c.titulo == titulo);

  // 2.- validar por el nombre si la canción existe
  if (searchCancion) {
    return res.status(200).json({ message: "La canción ya existe" });
  }

  // 3.- si la cancion no existe la agrego (push)
  const data = { artista, id, titulo, tono };

  canciones.push(data);
  fs.writeFileSync(nomArchivo, JSON.stringify(canciones), "utf-8");
  return res.status(201).json({
    resultado: true,
    canciones: data,
  });
  return;
});

//Eliminamos 
app.delete("/canciones/:id", (req, res) => {
    const {id} = req.params
    
    // 1.- leer el json de canciones
    const canciones = JSON.parse(fs.readFileSync("canciones.json"));
    
    // 2.- usar filter para devolver todos los elementos distintos del id que viene en los parametros
    const nuevasCanciones = canciones.filter((cancion) => cancion.id != id);
  
    // guardar nuevamente el archivo con el nuevo array 
    fs.writeFileSync("canciones.json", JSON.stringify(nuevasCanciones), "utf-8");
    return res.status(204).json()
  })

// Sobrescribimos
  app.put("/canciones/:id", (req, res) => {
    const { id } = req.params
  const canciones = req.body
  const cancionMod = JSON.parse(fs.readFileSync("canciones.json"));
  const index = cancionMod.findIndex((cancion) => cancion.id == id)
  cancionMod[index] = canciones
  fs.writeFileSync("canciones.json", JSON.stringify(cancionMod), "utf8");
  res.send("la canción se ha modificado con éxito")
  })  


app.listen(3000,() => {
    console.log('Servidor levantado en el puerto 3000!');
});
