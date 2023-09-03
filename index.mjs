import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import multer from "multer";
import { getStorage } from "firebase-admin/storage";
import { initializeApp, cert } from "firebase-admin/app";
import { uploadBytes, ref } from "firebase/storage";

const serviceAccount = "./service-data.json";

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "receitas-toti.appspot.com",
});

const app = express();
const allowedOrigins = ["http://localhost:3000"];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Stores

const storage = getStorage();
console.log(storage);

// console.log(bucket.file("images"));

// Configura multer para manejar la carga de imágenes
const storageConfig = multer.memoryStorage(); // Renombrado para evitar conflictos
const upload = multer({ storage: storageConfig });

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
app.post("/api/receitas", upload.single("image"), async (req, res) => {
  const receita = {
    id: uuidv4(),
    title: req.body.title,
    category: req.body.category,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    duration: req.body.duration,
    durationUnit: req.body.durationUnit,
  };

  if (req.file) {
    // Si se ha subido una imagen, guarda el archivo en Firebase Storage
    // Obtiene la referencia al bucket
    const storageRef = ref(storage, `images/${req.file.originalname}`);
    // const imageRef = bucket.file(`images/${req.file.originalname}`);

    try {
      // Sube la imagen y obtén su URL
      await uploadBytes(storageRef, req.file.buffer);
      const downloadURL = await getDownloadURL(storageRef);

      // Agrega la URL de la imagen a la receta
      receita.image = downloadURL;
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
      return res.status(500).send("Error al cargar la imagen");
    }
  }

  // Agregamos la receta a la lista
  receitas.push(receita);
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
    duration: req.body.duration,
    durationUnit: req.body.durationUnit,
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
