import React from 'react';
import Navbar from '../components/UI/Navbar';
import MovieDetails from '../components/UI/MovieDetails';
import MoviePage from './MoviePage';
import Hero from '../components/UI/Hero';



const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <MoviePage />
    </>
  );
};

export default Home;
