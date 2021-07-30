import React from 'react';
import Swal from "sweetalert2";

const Pedido = ({ pedido }) => {

  const mostrarPedido = () => {
    Swal.fire({
      title: 'Detalles del pedido'
    });
  }

  return (
    <div className="h-28 flex p-1">
      <div className="rounded-xl bg-white w-full shadow-lg flex flex-col p-2">
        <div className="flex justify-between p-1">
          <span className="font-semibold">{pedido.mesa}</span>
          <span className="text-red-600 font-bold">${pedido.total}</span>
        </div>
        <div className="flex justify-between p-1 items-center">
          <span className="text-red-600 font-semibold">{pedido.pedido[0].nombre}...</span>
          <button className="bg-white text-red-600 w-10 h-10 hover:bg-red-600 hover:text-white p-2 rounded-xl transition-colors text-lg" onClick={() => mostrarPedido()}>
            <ion-icon name="eye-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  )
};

export default Pedido;

