import React, { useState, useEffect } from "react";
import { GoPlus } from 'react-icons/go';

import "./styles.css";
import api from './services/api'

function App() {
  const [repository, setRepositories] = useState([]);

  useEffect( () => {
    api.get('repositories')
    .then( response => {
      setRepositories(response.data);
    });
  }, []);
  function cleanForm() {
    document.querySelector('#new_tech').value = "";
    document.querySelector('#title').value = "";
    document.querySelector('#url').value = "";
    document.querySelectorAll(".new-repoItem").forEach( (el) => {
      el.remove();
    });
  }

  function handleAddTech() {
    const techEl = document.querySelector('#new_tech')
    if (techEl.value) {
      const listEl = document.querySelector('.new-repoList')
      const newLi = document.createElement('li');
      newLi.innerText = techEl.value;
      newLi.classList.add('new-repoItem');
      listEl.append(newLi);
      techEl.value = '';
    } else {
      alert('Preencha o campo de tecnologias antes de tentar adicionar.');
    }
  }
  async function handleAddRepository(e) {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const url = document.querySelector('#url').value;
    let techs = [];
    try {
      const techsEl = document.querySelector('.new-repoList').getElementsByTagName('li');
      techs = Array.from(techsEl).map( li => li.innerText );
    } catch(err) {
      console.warn("Sem tecnologias");
    }
    
    const response = await api.post('/repositories', {
      title,
      url,
      techs
    });

    setRepositories([response.data, ...repository]);
    cleanForm();
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);

      setRepositories(repository.filter(repo => repo.id !== id));
    } catch(err) {
      console.log(err);
    }
  }
  return (
    <div>
      <section className="section__create">
        <form>
          <input id="title" type="text" placeholder="Título" required/>
          <input id="url" type="text" placeholder="URL" required/>
          <div className="input-group">
            <input id="new_tech" type="text" placeholder="Tecnologias"/>
            <GoPlus onClick={handleAddTech} size={26} color="#7159c1"/>
          </div>
          <ul className="new-repoList"></ul>
          <button type="button" onClick={ (e) => {
            handleAddRepository(e);
          }}>Adicionar</button>
        </form>
      </section>

      <section className="section__list">
        <ul data-testid="repo-list" className="repo-list">
        {repository.map( repo => (
            <li key={repo.id} className="repo-item">
              <section>
                <strong className="title repo-title">Título:</strong>
                <p>{repo.title}</p>
              </section>
              
              <section>
                <strong className="title url">URL:</strong>
                <p>{repo.url}</p>
              </section>

              <section>
                <strong className="title techs">Tecnologias:</strong>
                <ul>
                  {/* Não faço ideia de como mostrar vazio caso não exista valores dentro,
                  sem usar um componente */}
                  {repo.techs.map(tech => ( <li key={tech} className="tech">{tech}</li> ))}
                </ul>
              </section>

              <section>
                <strong className="title likes">Likes:</strong>
                <p>{repo.likes}</p>
              </section>

              <button type="button" onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          ))}
        </ul>      
      </section>
    </div>
  );
}

export default App;
