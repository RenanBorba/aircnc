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