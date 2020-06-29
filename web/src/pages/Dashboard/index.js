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
