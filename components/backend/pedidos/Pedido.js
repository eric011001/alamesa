import React from 'react';
import Swal from "sweetalert2";

const Pedido = ({ pedido }) => {
  console.log(pedido);
  const mostrarPedido = () => {

    console.log(pedido.pedido);
    let htmlPedido = ``;
    pedido.pedido.forEach((pedidoActual,index) => {
      htmlPedido += `
      <tr>
        <td>${index+1}</td>
        <td>${pedidoActual.nombre}</td>
        <td>${pedidoActual.cantidad}</td>
        <td>$${pedidoActual.precio}</td>
        <td>$${pedidoActual.precio*pedidoActual.cantidad}</td>
      </tr>
      ${ pedidoActual.extras && pedidoActual.extras[0]  ? (pedidoActual.extras.map((extraActual,index) => (
        `
        <tr>
          <td></td>
          <td>${index == 0 ? (`extras: `) : ("")}</td>
          <td>${extraActual}</td>
          <td></td>
          <td></td>  
        </tr>
      `
      ))) : ''}
      `;
    });
    htmlPedido += `
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>  
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td><strong>total:</strong> </td>
      <td><strong>$${pedido.total}</strong></td>  
    </tr>
    `
    /*if(pedido.comentario != ""){
      htmlPedido += `<h3>Comentario: </h3>
      <p>${pedido.comentario}</p>s`
    }*/
    Swal.fire({
      title: 'Detalles del pedido',
      confirmButtonText: 'Hecho',
      confirmButtonColor: '#ef4444',
      html: `
      <table id="table" style = "width:100%" border=1>
        <thead>
          <tr>
            <th>No.</th>
            <th>platillo</th>
            <th>cantidad</th>
            <th>precio</th>
            <th>total</th>
          </tr>
        </thead>
        <tbody>
        ${htmlPedido}
        </tbody>
      </table>
      
      ${pedido.comentario != "" ? (`
      <h3><strong>Comentario: </strong></h3>
      <p>${pedido.comentario}</p>
      `) : ''}
      `
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

