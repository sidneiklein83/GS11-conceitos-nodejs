const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title } = request.body;
  const { url } = request.body;
  const { techs } = request.body;
  //
  const object = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  //add na lista
  repositories.push(object);
  //devolve o list atualizado
  return response.json(object);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const { url } = request.body;
  const { techs } = request.body;
  //
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repositório não localizado!' })
  }
  //
  const object = repositories[index];
  object.title = title;
  object.url = url;
  object.techs = techs;
  //
  repositories[index] = object;
  //
  return response.json(object);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  //
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repositório não localizado!' })
  }
  repositories.splice([index], 1); //Remove somente 1 item
  //
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  //
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repositório não localizado!' })
  }
  const object = repositories[index];
  //incrementa o like
  object.likes = object.likes + 1;
  //
  repositories[index] = object;
  //
  return response.json(object);
});

module.exports = app;
