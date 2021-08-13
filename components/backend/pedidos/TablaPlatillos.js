import React from 'react';

const TablaPlatillos = ({platillos, idCategoria, agregaPlatillo}) => {

  const platillosCategoria = platillos.filter(platillo => {
    return platillo.categoria.id === idCategoria
  })

  return(
    <>
    {platillosCategoria.map(platillo => (
      <button key={platillo.id} type="button" onClick={() => agregaPlatillo(platillo)} className="m-2 block h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">{platillo.nombre}</button>
    ))}
    </>
  )
}

export default TablaPlatillos;