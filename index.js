const express = require("express");
const morgan = require("morgan");
const app = express();
const Athelete = require("./models/athelete");

require("dotenv").config();

const mongoose = require("mongoose");
const athelete = require("./models/athelete");
mongoose.set("strictQuery", false);

async function main() {
  await mongoose.connect(process.env.MONGO_CNN);
  console.log("DataBase connected");
}
main().catch((err) => console.log(err));

app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.json("¡Hola!");
});

app.post("/athelete",async (req,res) => {
  const athelete = req.body;
  //Validaciones
  const newAthelete = new Athelete(athelete);
  try{
    await newAthelete.save();
    res.status(201).json(newAthelete);
  }catch(err){
    res.status(500).json({message: err});
  }
})


app.get("/athelete",async (req,res) => {
  try{
    const atheletes = await Athelete.find();
    res.status(200).json(atheletes);
  }catch(err){
    res.status(500).json({message : err});
  }
})

// Captura el error 404 y lo envía al manejador de errores
app.use((req, res, next) => {
  const err = new Error("No encontrado");
  err.status = 404;
  return next(err);
});

// Manejadores de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    message: err.message,
    /*
     Si estamos en modo de desarrollo, incluye la traza de la pila (objeto de error completo)
     de lo contrario, es un objeto vacío para que el usuario no vea todo eso
    */
    error: app.get("env") === "desarrollo" ? err : {}
  });
});

app.listen(process.env.PORT, () => {
  console.log("El servidor está escuchando en el puerto "+process.env.PORT);
});