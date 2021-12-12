import React from 'react';
const TablaCategorias = ({categorias, setCategoriaActual}) => {
  return(
    <>
    {categorias.map(categoria => (
      <button  key = {categoria.id} type="button" onClick={() => setCategoriaActual(categoria.id)} className="m-2 block h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">{categoria.nombre}</button>
    ))}
    </>
  )
}

export default TablaCategorias