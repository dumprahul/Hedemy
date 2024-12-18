import React from 'react';
import bg_img from '../img/bg.jpg';
import OpenModal from './OpenModal';

function ProposeDAO() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${bg_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-5xl font-bold mb-4 text-white">propose a course in hedemy DAO.</h1>
      <p className="text-lg text-center mb-6 px-2 text-white font-bold">
        Hedemy DAO chooses perfect tailored courses for the learners in hedera environement.
      </p>
      <OpenModal/>
    </div>
  );
}

export default ProposeDAO;
