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
