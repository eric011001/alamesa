import React from 'react';

const Platillo = ({ platillo }) => {
  return (
    <div className="flex flex-col my-2 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-lg m-1 font-bold text-red-500">{platillo.nombre}</span>
        <span className="text-lg font-bold text-red-500 mr-2">${platillo.precio}</span>
      </div>
      <div className="pl-2 mb-2 flex">
        <div className="w-3/4">
          <span className="text-red-600 font-semibold">{platillo.descripcion}</span>
        </div>
        <div className="w-1/4 flex items-center p-1">
          <button className="bg-white w-full h-10 rounded-lg font-bold text-red-600 focus:text-white focus:bg-red-600 transition-colors outline-none">Agregar</button>
        </div>
      </div>
    </div>
  );
};

export default Platillo;
