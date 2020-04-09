const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const apiGit = "https://api.github.com/users/NicolasZim/repos"
async function getGitData() {
  try {
    const gitData = await axios.get(apiGit);
    return await gitData.data.map( async (repo) => {
      const techs = await axios.get(repo.languages_url);
      return {
        id: uuid(),
        title: repo.name,
        url: repo.html_url,
        techs: Object.getOwnPropertyNames(techs.data),
        likes: repo.stargazers_count
      }
    });
    
    
  } catch(err) {
    console.log('Error in api GitHub.')
    console.log(err)
  }
}

const repositories = [];

app.get("/repositories",  (request, response) => {
  const { id } = request.query;
  if (repositories.length <= 0) {
    repositories.push(getGitData());
  }
  if (id) {
    const repoIndex = repositories.findIndex(repo => repo.id === id);
    if (repoIndex >= 0) {
      return response.json(repositories[repoIndex]);
    }
    return response.status(404).json({error: "Id not found."});
  }
  console.log(repositories);
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const data = request.body;
  const repo = {
    id: uuid(),
    title: data.title,
    url: data.url,
    techs: [data.techs],
    likes: 0
  }
  repositories.push(repo);
  return response.json(repo.id);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params;
  const data = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  }

  const repoUpdated = {
    id: repoSelected.id,
    title: data.title,
    url: data.url,
    techs: data.techs,
    likes: repoSelected.likes
  };

  repositories[repoIndex] = repoUpdated;

  return response.json(repoUpdated);
});

app.delete("/repositories/:id", (req, res) => {
  const id = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  }

  repositories[repoIndex].likes += 1;
  return response.status(204).send({
    id: repositories[repoIndex].id,
    likes: repositories[repoIndex].likes
  });
});

module.exports = app;
