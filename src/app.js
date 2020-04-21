const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
//
//**início dos middlewares**/
//
function logRequest(request, response, next) {
  //Será disparado em todas as requisições...
  const { method, url } = request;
  const logLabel = `GS11-conceitos-nodejs | [${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  //console.log(logLabel);
  //
  //se não colocar este "return next()"", o middleware trava e não dá response
  next(); //Aqui usamos next() sem return justamente para acessar console.timeEnd(logLabel);
  console.timeEnd(logLabel);
}
app.use(logRequest); //Adicionei o middleware ao server

function validateUUID(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'O id informado é inválido!' })
  } else {
    return next();
  }
}
app.use('/repositories/:id', validateUUID); //Posso passar o Middleware assim tbm!
//
//**fim dos middlewares**/
//

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
