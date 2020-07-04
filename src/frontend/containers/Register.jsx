import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../actions';
import '../assets/styles/components/Register.scss';

const Register = (props) => {
  const [formRegister, setValues] = useState({
    email: '',
    id: '',
    name: '',
    password: '',
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues({
      ...formRegister,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.registerUser(formRegister, '/login');
  };

  return (
    <section className='register'>
      <section className='register__container'>
        <h2>Regístrate</h2>
        <form className='register__container--form' onSubmit={handleSubmit}>
          <input
            name='name'
            onChange={handleInput}
            className='input'
            type='text'
            placeholder='Nombre'
          />
          <input
            name='email'
            onChange={handleInput}
            className='input'
            type='text'
            placeholder='Correo'
          />
          <input
            name='password'
            onChange={handleInput}
            className='input'
            type='password'
            placeholder='Contraseña'
          />
          <button type='submit' className='button'>
            Registrarme
          </button>
        </form>
        <Link to='/login'>Iniciar sesión</Link>
      </section>
    </section>
  );
};

const mapDispatchToProps = {
  registerUser,
};

Register.propTypes = {
  registerUser: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(Register);
