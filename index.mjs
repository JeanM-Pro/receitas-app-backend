import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://receitas-toti.web.app",
];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
  })
);

const usuarios = [];

app.post("/api/usuarios", (req, res) => {
  const usuario = {
    id: uuidv4(),
    userId: req.body.userId,
    nombre: req.body.nombre,
    correo: req.body.correo,
    img: req.body.img,
    redesSociales: {
      facebook: req.body.redesSociales.facebook,
      twitter: req.body.redesSociales.twitter,
      instagram: req.body.redesSociales.instagram,
      linkedin: req.body.redesSociales.linkedin,
    },
  };

  // Agregamos el usuario a la lista
  usuarios.unshift(usuario);
  res.send(usuario);
});

app.get("/api/usuarios", (req, res) => {
  res.json(usuarios);
});
// Ovbtener usuario por userId
app.get("/api/usuarios/:userId", (req, res) => {
  const usuario = usuarios.find((c) => c.userId === req.params.userId);
  if (!usuario) return res.status(404).send("Usuario no encontrado");
  else res.send(usuario);
});

app.put("/api/usuarios/:userId", (req, res) => {
  const userId = req.params.userId;
  const usuarioIndex = usuarios.findIndex((u) => u.id === userId);

  if (usuarioIndex === -1) {
    return res.status(404).send("Usuario no encontrado");
  }

  const updatedUsuario = {
    id: userId,
    userId,
    nombre: req.body.nombre,
    correo: req.body.correo,
    img: req.body.img,
    redesSociales: {
      facebook: req.body.redesSociales.facebook,
      twitter: req.body.redesSociales.twitter,
      instagram: req.body.redesSociales.instagram,
      linkedin: req.body.redesSociales.linkedin,
    },
  };

  usuarios[usuarioIndex] = updatedUsuario;
  res.send(updatedUsuario);
});

const receitas = [];

app.get("/", (req, res) => {
  res.send("Node JS api");
});

app.get("/api/receitas", (req, res) => {
  res.send(receitas);
});

app.get("/api/receitas/:id", (req, res) => {
  const receita = receitas.find((c) => c.id === req.params.id);
  if (!receita) return res.status(404).send("Receita no encontrada");
  else res.send(receita);
});

// Ruta POST para agregar una receta
app.post("/api/receitas", (req, res) => {
  const receita = {
    id: uuidv4(),
    title: req.body.title,
    category: req.body.category,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    duration: req.body.duration,
    durationUnit: req.body.durationUnit,
    img: req.body.img,
    userName: req.body.userName,
    userImage: req.body.userImage,
    userId: req.body.userId,
    favoritedUsers: req.body.favoritedUsers,
    likes: req.body.likes,
    disLikes: req.body.disLikes,
  };

  // Agregamos la receta a la lista
  receitas.unshift(receita);
  res.send(receita);
});

app.put("/api/receitas/:id", (req, res) => {
  const receitaId = req.params.id;
  const receitaIndex = receitas.findIndex((c) => c.id === receitaId);

  if (receitaIndex === -1) {
    return res.status(404).send("Receita no encontrada");
  }

  const updatedReceita = {
    id: receitaId,
    title: req.body.title,
    category: req.body.category,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    img: req.body.img,
    userName: req.body.userName,
    userImage: req.body.userImage,
    userId: req.body.userId,
    duration: req.body.duration,
    durationUnit: req.body.durationUnit,
    favoritedUsers: req.body.favoritedUsers,
    likes: req.body.likes,
    disLikes: req.body.disLikes,
  };

  receitas[receitaIndex] = updatedReceita;
  res.send(updatedReceita);
});

app.delete("/api/receitas/:id", (req, res) => {
  const receita = receitas.find((c) => c.id === req.params.id);
  if (!receita) return res.status(404).send("Receita no encontrada");
  const index = receitas.indexOf(receita);
  receitas.splice(index, 1);
  res.send(receita);
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}`));
