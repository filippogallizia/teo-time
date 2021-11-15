import React from 'react';
import mainImage from '../../shared/images/mainImage.jpeg';

const HomePage = () => {
  return (
    <div className="flex justify-center">
      <div className="absolute top-1/3">
        <img src={mainImage} alt="foto-padre-osteopatia" />
      </div>
    </div>
  );
};
export default HomePage;
