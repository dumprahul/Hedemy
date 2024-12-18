import React from 'react';
import bg_img from '../img/bg.jpg';
import hedera_img from '../img/h.jpg'

function Stake() {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${bg_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Side Content */}
      <div className="flex flex-col justify-center px-8 w-1/2">
        <h1 className="text-5xl font-bold mb-4 text-white">stake a course.</h1>
        <p className="text-lg mb-6 text-white font-bold max-w-md">
          Hedemy DAO chooses perfect tailored courses for the learners in the Hedera environment.
        </p>
      </div>

      {/* Right Side Boxes */}
      <div className="flex items-center justify-center w-1/2">
        <div className="grid grid-cols-2 gap-8 mt-12 p-4">
          {/* Box 1 */}
          <div className="w-80 h-80 bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-center p-6" style={{ backgroundImage: `url(${bg_img})` }}>
            <h3 className="text-xl font-bold text-white">Course 1</h3>
            <p className="text-gray-300 mb-2">Learn advanced techniques and strategies tailored to your needs.</p>
            <p className="text-sm text-gray-300 mb-4">Status: Ongoing</p>
            <button className="btn btn-primary">Stake Now</button>
          </div>
          {/* Box 2 */}
          <div className="w-80 h-80 bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-center p-6" style={{ backgroundImage: `url(${bg_img})` }}>
            <h3 className="text-xl font-bold text-white">Course 2</h3>
            <p className="text-gray-300 mb-2">Discover new perspectives and approaches to learning with this course.</p>
            <p className="text-sm text-gray-300 mb-4">Status: Available</p>
            <button className="btn btn-primary">Stake Now</button>
          </div>
          {/* Box 3 */}
          <div className="w-80 h-80 bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-center p-6" style={{ backgroundImage: `url(${bg_img})` }}>
            <h3 className="text-xl font-bold text-white">Course 3</h3>
            <p className="text-gray-300 mb-2">Gain insights from industry experts and build your knowledge base.</p>
            <p className="text-sm text-gray-300 mb-4">Status: Full</p>
            <button className="btn btn-primary">Stake Now</button>
          </div>
          {/* Box 4 */}
          <div className="w-80 h-80 bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-center p-6" style={{ backgroundImage: `url(${bg_img})` }}>
            <h3 className="text-xl font-bold text-white">Course 4</h3>
            <p className="text-gray-300 mb-2">Explore innovative solutions and apply them to your field of study.</p>
            <p className="text-sm text-gray-300 mb-4">Status: Open</p>
            <button className="btn btn-primary">Stake Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stake;
