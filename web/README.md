<div align="center">

## Rocketseat - Semana OmniStack 9.0
# Projeto - Aplicação AirCnC Web ReactJS (AirCode n'Coffee)

</div>

<br>

<div align="center">

[![Generic badge](https://img.shields.io/badge/Made%20by-Renan%20Borba-purple.svg)](https://shields.io/) [![Build Status](https://img.shields.io/github/stars/RenanBorba/aircnc.svg)](https://github.com/RenanBorba/aircnc) [![Build Status](https://img.shields.io/github/forks/RenanBorba/aircnc.svg)](https://github.com/RenanBorba/aircnc) [![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

</div>

<br>

<div align="center">

![logo](https://user-images.githubusercontent.com/48495838/80022434-6f070e80-84b2-11ea-9125-7c281fad84e2.png)

</div>

<br>

Aplicação Front-end desenvolvida em ReactJS para clone do app AirBnB web responsivo, voltada para locação de spots (locais) para devs, permitindo interação em tempo real (Web Socket) entre proprietário (web) e cliente (mobile).

<br><br>

## :rocket: Tecnologias
<ul>
  <li>Components</li>
  <li>Routes</li>
  <li>react-router-dom</li>
  <li>Services API</li>
  <li>Axios</li>
  <li>History</li>
  <li>LocalStorage</li>
  <li>useState</li>
  <li>useEffect</li>
  <li>useMemo</li>
  <li>socket.io-client WebSocket</li>
  <li>CSS</li>
  <li>Fonts</li>
</ul>

<br><br>

## :arrow_forward: Start
<ul>
  <li>npm install</li>
  <li>npm run start / npm start</li>
</ul>

<br><br><br>

## :mega: ⬇ Abaixo as principais estruturas e interfaces:

<br><br><br>

## src/App.js
```js
import React from 'react';
import './App.css';

import logo from './assets/logo.svg';

import Routes from './routes';

function App() {
  return (
    <div className='container'>
      <img src={ logo } alt='AirCnC' />

      <div className='content'>
        <Routes />
      </div>
    </div>
  );
};

export default App;
```

<br><br>

## src/App.css
```css
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box
}

html, body, #root {
  min-height: 100%
}

body {
  background: #000 url('./assets/background.jpg') no-repeat;
  background-size: cover;
  -webkit-font-smoothing: antialiased !important
}

body, input, button {
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-size: 14px
}

.container {
  margin: 80px auto 0;
  max-width: 450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center
}

.content {
  width: 100%;
  background: #FFF;
  margin-top: 50px;
  border-radius: 4px;
  padding: 30px
}

.content > p {
  font-size: 22px;
  line-height: 30px;
  margin-bottom: 30px
}

.content form {
  display: flex;
  flex-direction: column
}

.content form label {
  font-size: 14px;
  color: #444;
  font-weight: bold;
  margin-bottom: 8px
}

.content form label span {
  font-weight: normal;
  color: #999;
  font-size: 12px
}

.content form input {
  margin-bottom: 20px;
  border: 1px solid #DDD;
  border-radius: 2px;
  height: 45px;
  padding: 0 15px;
  font-size: 16px
}

.content button.btn {
  border: 0;
  border-radius: 2px;
  width: 100%;
  height: 42px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: bold;
  background: #F05A5B;
  color: #FFF;
  cursor: pointer
}

.content button.btn:hover {
  background: #E14F50
}
```


<br><br>


## src/routes.js
```js
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import New from './pages/New';

export default function Routes() {
  return (
    // Permite apenas uma rota de acesso por vez
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={ Login } />
        <Route path='/dashboard' component={ Dashboard } />
        <Route path='/new' component={ New } />
      </Switch>
    </BrowserRouter>
  );
};
```


<br><br>


## src/services/api.js
```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
});

export default api;
```


<br><br>


## src/pages/Login/index.js
```js
import React, {useState} from 'react';
import api from '../../services/api';

export default function Login({ history }) {
  // Atualiza valor do estado
  const [email, setEmail] = useState('');

  async function handleSubmit(event) {
    // Evita evento default, funcionalidade padrão
    event.preventDefault();

    const response = await api.post('/sessions', { email })

    const { _id } = response.data;

    //  Mantém o dado gravado no Local Storage mesmo se o browser é fechado e reaberto
    localStorage.setItem('user', _id);

    // Navegação
    history.push('/dashboard');
  }

  return (
    // Sintaxe curta Fragment
    <>
      <p>
        Ofereça <strong>spots</strong> para programadores e encontre
          <strong>talentos</strong> para sua empresa
      </p>

      <form onSubmit={ handleSubmit }>
        <label htmlFor='email'>E-MAIL *</label>
        <input type='email' id='email' placeholder='Seu melhor e-mail' value={ email }
          // Arrow function responsável por setar o valor no evento
          onChange={event => setEmail(event.target.value)}
        />

        <button className='btn' type='submit'>Entrar</button>
      </form>
    </>
  )
};
```


<br><br>


## Login

![6](https://user-images.githubusercontent.com/48495838/66859016-dcb10b80-ef60-11e9-8d21-ed541471d52b.JPG)
<br><br><br><br>


## src/pages/Dashboard/index.js
```js
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';

import api from '../../services/api';
import './styles.css';
import { request } from 'http';

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);

  const user_id = localStorage.getItem('user');

  /*
    MEMOrizar variável user_id
    Não refazer conexão, exceto com um novo id
  */
  const socket = useMemo(() => socketio('http://localhost:3333', {
    query: { user_id },
  // Array dependência
  }), [user_id]);

  useEffect(() => {
    // Ouvir booking request
    socket.on('booking_request', data => {
      /* Adicionar às requisições/solicitações, p/ não sobrescrever as
      já feitas anteriormente */
      setRequests([...requests, data]);
    })
  }, [requests, socket]);

  useEffect(() => {
    async function loadSpots() {
      const user_id = localStorage.getItem('user');
      const response = await api.get('/dashboard', {
        headers: { user_id }
      });

    setSpots(response.data);
  }

    loadSpots();
  // Executa apenas uma vez
  }, []);

  async function handleAccept(id) {
    await api.post(`/bookings/${id}/approvals`);

    // Filtrar p/ remover a requisição recente das demais
    setRequests(requests.filter(request => request._id !== id)) ;
  }

  async function handleReject(id) {
    await api.post(`/bookings/${id}/rejections`);

    setRequests(requests.filter(request => request._id !== id)) ;
  }

  return (
    <>
      <ul className='notifications'>
        { requests.map(request => (
          <li key={ request._id }>
            <p>
              <strong>{ request.user.email }</strong> está solicitando uma reserva em
                <strong>{ request.spot.company }</strong> para a data: <strong>{ request.date }</strong>
            </p>
              <button className='accept' onClick={() => handleAccept(request._id)}>ACEITAR</button>
              <button className='reject' onClick={() => handleReject(request._id)}>REJEITAR</button>
          </li>
        )) }
      </ul>

      <ul className='spot-list'>
        { spots.map(spot => (
          <li key={ spot._id }>
            {/* Reajusta igualmente todas as imagens nos thumbnails
            Object Javascript */}
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
            <strong>{ spot.company }</strong>
            {/* ?, IF-THEN --- :, IF-THEN-ELSE */}
            <span>{ spot.price ? `R$${spot.price}/dia` : 'GRATUITO' }</span>
          </li>
        )) }
      </ul>

      {/* Redirecionamento */}
      <Link to='/new'>
        <button className='btn'>Cadastrar novo spot</button>
      </Link>
    </>
  )
};
```

<br><br>


## src/pages/New/index.js
```js
import React, { useState, useMemo } from 'react';

import api from '../../services/api';
import camera from '../../assets/camera.svg';
import './styles.css';

export default function New({ history }) {
  const [company, setCompany] = useState('');
  const [techs, setTechs] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(null);

  // Gerar valor para variável preview
  const preview = useMemo(() => {
    // Criar variável temporária p/ URL
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData();

    const user_id = localStorage.getItem('user');

    // Adicionar as informações dentro do data
    data.append('thumbnail', thumbnail);
    data.append('company', company);
    data.append('techs', techs);
    data.append('price', price);

    await api.post('/spots', data, {
      // Informar usuário logado
      headers: { user_id }
    });

    // Navegação
    history.push('/dashboard');
  }

  return (
    <form onSubmit={ handleSubmit }>
      <label id='thumbnail' style={{ backgroundImage: `url(${preview})` }}
          class={ thumbnail ? 'has-thumbnail' : '' }
      >
        <input type='file' onChange={event => setThumbnail(event.target.files[0])} />
        {/* Ícone miniatura câmera */}
        <img src={ camera } alt='Selecionar imagem' />
      </label>

      <label htmlFor='company'>EMPRESA *</label>
      <input id='company' placeholder='Sua incrível empresa'
        value={ company }  onChange={event => setCompany(event.target.value)}
      />

      <label htmlFor='techs'>TECNOLOGIAS *
        <span> (separadas por vírgula)</span></label>
      <input id='techs' placeholder='Quais tecnologias usam?'
        value={ techs }  onChange={event => setTechs(event.target.value)}
      />

      <label htmlFor='price'>VALOR DA DIÁRIA *
        <span> (em branco para GRATUITO)</span></label>
      <input id='price' placeholder='Valor cobrado por dia'
        value={ price }  onChange={event => setPrice(event.target.value)}
      />

      <button type='submit' className='btn'>Cadastrar</button>
    </form>
  )
};
```

<br><br>

## Cadastrar spot

![7](https://user-images.githubusercontent.com/48495838/66773818-57612480-ee96-11e9-83f7-70ed53439eda.JPG)
<br><br>

## Solicitação de reserva (Dashboard)

![00](https://user-images.githubusercontent.com/48495838/76796253-ce824800-67a9-11ea-905f-8a44cfda5819.jpg)
<br><br>

## Confirmação de reserva (Dashboard)

![01](https://user-images.githubusercontent.com/48495838/76796250-cd511b00-67a9-11ea-8668-bd367bce6ee9.jpg)
