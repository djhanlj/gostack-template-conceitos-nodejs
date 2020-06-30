const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likesRepository = [];


function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ erro: 'Invalid repository Id.' })
  }

  return next();
}


function validateRepositoryLikes(request, response, next) {
  const { likes } = request.body;

  if (likes > 0) {
    return response.status(400).json({ erro: 'Invalid like bigger zero.' })
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", validateRepositoryLikes, (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { likes } = repositories[repositoryIndex];
  repositoryUpdate = { id, title, url, techs, likes };
  console.log(repositoryUpdate);
  repositories[repositoryIndex] = repositoryUpdate;

  return response.json(repositoryUpdate)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400);
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { likes } = repositories[repositoryIndex].likes
  const newLike = { likes: likes ? likes + 1 : 1 };

  console.log(newLike);
  repositories[repositoryIndex].likes = newLike;
  return response.json(newLike)


});

module.exports = app;
