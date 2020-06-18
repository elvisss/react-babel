import React from 'react';
import '../assets/styles/components/NotFound.scss';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <>
    <section className='not-found'>
      <h2 className='not-found__title'>404</h2>
      <h3>Página no encontrada</h3>
      <Link to='/'>Llévame al Home!</Link>
    </section>
  </>
);

export default NotFound;
