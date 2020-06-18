/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import Footer from '../components/Footer';
import useInitialState from '../hooks/useInitialState';
import '../assets/styles/App.scss';

const API = 'http://localhost:3000/initialState';

const App = () => {
  const initialState = useInitialState(API);
  return (
    <div className='App'>
      <Header />
      <Search />

      {initialState.mylist.length && (
        <Categories title='Mi Lista'>
          <Carousel>
            {initialState.trends?.map((item) => {
              const { id, ...rest } = item;
              return <CarouselItem key={id} {...rest} />;
            })}
          </Carousel>
        </Categories>
      )}

      <Categories title='Tendencias'>
        <Carousel>
          {initialState.trends.map((item) => {
            const { id, ...rest } = item;
            return <CarouselItem key={id} {...rest} />;
          })}
        </Carousel>
      </Categories>

      <Categories title='Originales de Platzi Video'>
        <Carousel>
          {initialState.originals.map((item) => {
            const { id, ...rest } = item;
            return <CarouselItem key={id} {...rest} />;
          })}
        </Carousel>
      </Categories>

      <Footer />
    </div>
  );
};

export default App;
