import express, { json } from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://node-project-production-dadb.up.railway.app",
  "https://lista-de-contatos-12fdd.web.app",
];

app.use(json());
app.use(
  cors({
    origin: allowedOrigins,
  })
);

const contacts = [];

app.get("/", (req, res) => {
  res.send("Node JS api");
});

app.get("/api/contacts", (req, res) => {
  const { uid } = req.query;
  const filteredContacts = contacts.filter((contact) => contact.uid === uid);
  res.send(filteredContacts);
});

app.get("/api/contacts/:id", (req, res) => {
  const contact = contacts.find((c) => c.id === req.params.id);
  if (!contact) return res.status(404).send("Conacto no encontrado");
  else res.send(contact);
});

app.post("/api/contacts", (req, res) => {
  const contact = {
    id: uuidv4(),
    nome: req.body.nome,
    tlf: parseInt(req.body.tlf),
    email: req.body.email,
    endereco: req.body.endereco,
    gender: req.body.gender,
    uid: req.body.uid,
  };

  contacts.push(contact);
  res.send(contact);
});

app.put("/api/contacts/:id", (req, res) => {
  const contactId = req.params.id;
  const contactIndex = contacts.findIndex((c) => c.id === contactId);

  if (contactIndex === -1) {
    return res.status(404).send("Contacto no encontrado");
  }

  const updatedContact = {
    id: contactId,
    nome: req.body.nome,
    tlf: parseInt(req.body.tlf),
    email: req.body.email,
    endereco: req.body.endereco,
    gender: req.body.gender,
    uid: req.body.uid,
  };

  contacts[contactIndex] = updatedContact;
  res.send(updatedContact);
});

app.delete("/api/contacts/:id", (req, res) => {
  const contact = contacts.find((c) => c.id === req.params.id);
  if (!contact) return res.status(404).send("Contacto no encontrado");
  const index = contacts.indexOf(contact);
  contacts.splice(index, 1);
  res.send(contact);
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}`));
