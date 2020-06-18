/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import useInitialState from '../hooks/useInitialState';

const API = 'http://localhost:3000/initialState';

const Home = () => {
  const initialState = useInitialState(API);
  return (
    <>
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
    </>
  );
};

export default Home;
