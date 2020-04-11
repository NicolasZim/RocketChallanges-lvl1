const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", async (request, response) => {
  const { id } = request.query;
  if (id) {
    const repoIndex = repositories.findIndex(repo => repo.id === id);
    if (repoIndex >= 0) {
      return response.json(repositories[repoIndex]);
    }
    return response.status(404).json({error: "Id not found."});
  }
  return response.json(repositories);
  // DONE
});

app.post("/repositories", (request, response) => {
  const data = request.body;
  const repo = {
    id: uuid(),
    title: data.title,
    url: data.url,
    techs: data.techs,
    likes: 0
  }
  repositories.push(repo);
  return response.json(repo);
  // DONE
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const data = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  console.log(data, id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  }
  const repoSelected = repositories[repoIndex];
  
  const repoUpdated = {
    id: repoSelected.id,
    title: data.title,
    url: data.url,
    techs: data.techs,
    likes: repoSelected.likes
  };

  repositories[repoIndex] = repoUpdated;

  return response.json(repoUpdated);
  // DONE
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  }

  repositories[repoIndex].likes += 1;
  return response.json({
    likes: repositories[repoIndex].likes
  });
  // DONE
});

module.exports = app;
