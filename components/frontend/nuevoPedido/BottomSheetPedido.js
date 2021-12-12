import React, { useState } from 'react';
import BottomPlatillo from './BottomPlatillo';
import Swal from 'sweetalert2';
const BottomSheetPedido = () => {
  const [opened, setOpened] = useState(false);
  
  const platillos = [
    {
      nombre: 'Pito',
      cantidad: 2,
      precio: 80,
      precioExtras: 20
    },
    {
      nombre: 'Pito',
      cantidad: 2,
      precio: 80,
      precioExtras: 20
    },
    {
      nombre: 'Pito',
      cantidad: 2,
      precio: 80,
      precioExtras: 20
    },
    {
      nombre: 'Pito',
      cantidad: 2,
      precio: 80,
      precioExtras: 20
    },
    {
      nombre: 'Pito',
      cantidad: 2,
      precio: 80,
      precioExtras: 20
    }
  ];

  const agregaComentario = () => {
    Swal.fire({
      title: 'Agrega un comentario',
      html: `
        <textarea id="comentarioId" class="p-2 mb-5 w-full h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all">
        `,
      confirmButtonText: 'guardar Comentario',
      confirmButtonColor: '#ef4444',
      focusConfirm: false,
      preConfirm: async () => {
        const comment = Swal.getPopup().querySelector('#comentarioId').value

        if (!comment ) {
          Swal.showValidationMessage(`Porfavor de completrar el formulario`)
        }
        //aqui va todo
      }
    }).then((result) => {
        if(result.isConfirmed && result.value){
          
        }
    })
  } 

  const toggleOpened = () => {
    const tempOpened = opened;
    setOpened(!tempOpened);
  };
  //60fdc48ef8ebe50bf0861bb5
  return (
    <div className={opened ? 'fixed flex flex-col w-full rounded-t-xl shadow-xl bottomsheet-opened bg-white': 'bottomsheet fixed flex flex-col w-full rounded-t-xl shadow-xl bottomsheet-closed bg-white'} style={{'bottom': '0px', 'left': '0px', boxShadow: '0px -10px 20px 0px rgba(0,0,0,0.1)'}} >
      <div className="h-10 flex justify-center items-center" onClick={() => { toggleOpened(); }}>
        <span className="bg-gray-400 w-10 h-1 inline-block rounded-full"></span>
      </div>
      <div className="px-2">
        <span className="font-bold text-red-500 m-1 text-lg">Platillos</span>
        <hr className="bg-gray-300 mx-1 mt-1 mb-2" style={{height: '2px'}} />
        <div className=" max-h-40 flex flex-col overflow-auto" style={{minHeight: '5rem'}}>
          {platillos.map((platillo, index) => (
            <BottomPlatillo key={index} />
          ))}
        </div>
        <hr className="bg-gray-300 mx-1 mt-1 mb-2" style={{height: '2px'}} />
        <div className="flex flex-row justify-between items-center">
          <span className="m-2 text-xl font-bold text-red-600">Total</span>
          <span className="m-2 text-xl font-bold text-red-600">$123</span>
        </div>
        <div className="flex justify-center items-center">
        <button onClick={() => agregaComentario()} className="bg-red-500 hover:bg-red-600 focus:bg-red-600 transition-colors m-4 p-2 text-sm font-bold text-white tracking-widest rounded-xl">Agregar comentario</button>
          <button className="bg-red-500 hover:bg-red-600 focus:bg-red-600 transition-colors m-4 p-2 text-sm font-bold text-white tracking-widest rounded-xl">ORDENAR</button>
        </div>
      </div>
    </div>
  );
};

export default BottomSheetPedido;
