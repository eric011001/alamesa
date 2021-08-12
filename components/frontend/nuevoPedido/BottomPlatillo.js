import React from 'react';

const BottomPlatillo = () => {
  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-row justify-between">
        <span className="text-red-500 font-bold p-1">Pito</span>
        <span className="text-red-500 font-bold p-1 ml-auto mr-8">2</span>
        <span className="text-red-500 font-bold p-1">$80</span>
      </div>
      <div className="flex flex-row justify-end">
        <span className="text-red-500 font-bold p-1">$180</span>
      </div>
    </div>
  )
};

export default BottomPlatillo;

