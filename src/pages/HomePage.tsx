import React from 'react';
import Hero from '../components/Home/Hero';
import FeaturedKits from '../components/Home/FeaturedKits';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedKits />
    </div>
  );
};

export default HomePage;