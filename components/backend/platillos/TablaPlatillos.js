import React from 'react'
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Platillo from './Platillo';
const OBTENER_PLATILLOS = gql`
    query Query {
  obtenerPlatillos {
    categoria {
      nombre
      orden
    }
    descripcion
    disponible
    extras {
      precio
      nombre
    }
    id
    nombre
    precio
  }
}
`;
const TablaPlatillos = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(OBTENER_PLATILLOS);

  if (loading) {
    return (
      <div className="ml-6 mt-3 flex flex-grow items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-100" cx="12" cy="12" r="10" stroke="red" strokeWidth="3"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }
    const { obtenerPlatillos } = data;
    console.log(obtenerPlatillos);
  const agregarPlatillo = () => {
    router.push('/controlPanel/nuevoPlatillo');
  }
  return (
    <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
      <div className="h-16 flex justify-left items-center">
        <h1 className="ml-4 text-2xl font-bold text-red-500">Lista de platillos</h1>
      </div>
      <div className="flex-grow m-8 h-16 overflow-y-auto rounded-xl">
        <table className="table-auto w-full overflow-y-auto">
          <thead>
            <tr className="bg-red-500">
              <th className="text-white px-4 py-2">Nombre</th>
              <th className="text-white px-4 py-2">Precio</th>
              <th className="text-white px-4 py-2">Disponible</th>
              <th className="text-white px-4 py-2">Categoría</th>
              <th className="text-white px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {obtenerPlatillos.map(platillo => (
              <Platillo key={platillo.id} platillo={platillo} />
            ))}
          </tbody>
        </table>
        <div className="absolute flex" style={{ bottom: '3em', right: '3em' }}>
          <button onClick={() => router.push('/controlPanel/categorias')} className="mr-2 bg-red-500 text-white w-16 h-16 rounded-xl transition-colors shadow-xl hover:bg-red-600 p-4">
            <ion-icon name="albums-outline" style={{ fontSize: '2em' }}></ion-icon>
          </button>
          <button onClick={() => agregarPlatillo()} className="bg-red-500 text-white w-16 h-16 rounded-xl transition-colors shadow-xl hover:bg-red-600 p-4">
            <ion-icon name="add-circle-outline" style={{ fontSize: '2em' }}></ion-icon>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default TablaPlatillos;