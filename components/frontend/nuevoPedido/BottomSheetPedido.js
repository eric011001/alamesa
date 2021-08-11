import React, { useState } from 'react';

const BottomSheetPedido = () => {
  const [opened, setOpened] = useState(false);

  const toggleOpened = () => {
    const tempOpened = opened;
    setOpened(!tempOpened);
  };
  //60fdc48ef8ebe50bf0861bb5
  return (
    <div className={opened ? 'fixed flex flex-col w-full rounded-t-xl shadow-xl bottomsheet-opened': 'bottomsheet fixed flex flex-col w-full rounded-t-xl shadow-xl bottomsheet-closed'} style={{'bottom': '0px', 'left': '0px', boxShadow: '0px -10px 20px 0px rgba(0,0,0,0.1)'}} >
      <div className="h-10 flex justify-center items-center" onClick={() => { toggleOpened(); }}>
        <span className="bg-gray-400 w-10 h-2 inline-block rounded-full"></span>
      </div>
      <div className="">
        <span className="font-bold text-red-500 m-1 text-lg">Platillos</span>
        <hr className="bg-gray-300 mx-1 mt-1 mb-2" style={{height: '2px'}} />
        <div className=" max-h-40 xs:max-h-40 sm:max-h-40 md:max-h-56 flex flex-col overflow-auto" style={{minHeight: '5rem'}}>
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
        </div>
        <hr className="bg-gray-300 mx-1 mt-1 mb-2" style={{height: '2px'}} />
        <div className="flex flex-row justify-between items-center">
          <span className="m-2 text-xl font-bold text-red-600">Total</span>
          <span className="m-2 text-xl font-bold text-red-600">$123</span>
        </div>
        <div className="flex justify-center items-center">
          <button className="bg-red-500 hover:bg-red-600 focus:bg-red-600 transition-colors m-4 p-2 text-sm font-bold text-white tracking-widest rounded-xl">ORDENAR</button>
        </div>
      </div>
    </div>
  );
};

export default BottomSheetPedido;
