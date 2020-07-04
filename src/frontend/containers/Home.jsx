/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';

const Home = ({ myList, trends, originals }) => {
  return (
    <>
      <Search isHome />

      {myList.length > 0 && (
        <Categories title='Mi Lista'>
          <Carousel>
            {myList?.map((item) => {
              return <CarouselItem key={item._id} {...item} isList />;
            })}
          </Carousel>
        </Categories>
      )}

      <Categories title='Tendencias'>
        <Carousel>
          {trends.map((item) => {
            return <CarouselItem key={item._id} {...item} />;
          })}
        </Carousel>
      </Categories>

      <Categories title='Originales de Platzi Video'>
        <Carousel>
          {originals.map((item) => {
            return <CarouselItem key={item._id} {...item} />;
          })}
        </Carousel>
      </Categories>
    </>
  );
};

const mapStateToProps = (state) => {
  const { myList, trends, originals } = state;
  return {
    myList,
    trends,
    originals,
  };
};

export default connect(mapStateToProps, null)(Home);
