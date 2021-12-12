import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import HeadApp from '../../components/Head';
import Select from 'react-select';
import Swal from 'sweetalert2';
import BottomSheetPedido from '../../components/frontend/nuevoPedido/BottomSheetPedido';
import Platillo from '../../components/frontend/nuevoPedido/Platillo';

const OBTENER_PLATILLOS = gql`
query Query {
  obtenerPlatillosDisponibles {
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

const OBTENER_MESA = gql`
  query Query($id: ID!) {
    obtenerMesa(id: $id) {
      id
      nombre
    }
  }
`;

const nuevoPedido = () => {
  const router = useRouter();
  const { query: { pid: mesa } } = router;
  const { data: dataPlatillos, loading: loadingPlatillos, error: errorPlatillo } = useQuery(OBTENER_PLATILLOS);
  const {data,loading,error} = useQuery(OBTENER_MESA,{
    variables:{
      id: mesa ? (mesa) : ''
    }
  })
  const [platillosSeleccionados, setPlatillosSeleccionados] = useState([]);

  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#d1d5db' : '#e5e7eb',
      color: '#212529',
    }),
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.75em',
      backgroundColor: state.isFocused ? '#d1d5db' : '#e5e7eb',
      borderWidth: '0px'
    }),
    menuList: (provided, state) => ({
      ...provided,
      borderRadius: '0.75em'
    })
  };
  if (loadingPlatillos || loading) {
    return (
      'Cargando...'
    );
  }
  if(!data){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'vaya, parece que tu mesa no esta disponible. Prueba a escanear de nuevo el codigo ubicado en tu mesa',
      confirmButtonColor: '#ef4444',
      
    })
    router.push('/');
    return(
      <HeadApp />
    )
  }
  const { obtenerPlatillosDisponibles } = dataPlatillos;
  console.log(dataPlatillos);
  return (
    <>
      <HeadApp />
      <div className="flex flex-col bg-white h-full">
        <div className="fixed bg-white w-full pb-4">
          <h1 className="font-bold text-3xl text-red-500 p-2">Menú</h1>
          <span className="font-bold text-xl text-red-500 p-2">Mesa: {data.obtenerMesa ? (data.obtenerMesa.nombre) : ('')}</span>
        </div>
        <div className="mt-24 p-2 h-5/6 overflow-auto mb-10 flex flex-col flex-nowrap">
          {obtenerPlatillosDisponibles.map((platillo, index) => (
            <Platillo key={index} platillo={platillo}/>
          ))}
        </div>
        <BottomSheetPedido />
      </div>
    </>
      /*{ <div className="bg-white w-full sm:w-full h-full md:w-2/3 lg:w-2/3 xl:w-1/2 shadow-md rounded-xl flex flex-col justify-center items-center">
        <h1 className="font-bold text-3xl text-red-500 p-2">Mesa: {mesa}</h1>
        <h3 className="font-bold text-xl text-red-500">Elige tu pedido:</h3>
        <br/>
        <div className="flex flex-row w-full mx-2">
          <Select id="platillosInput"
            options={obtenerPlatillosDisponibles}
            getOptionValue={(platillo) => platillo.nombre}
            getOptionLabel={(platillo) => `${platillo.nombre} - $${platillo.precio}`}
            isMulti={true}
            styles={selectStyles}
            className="flex-grow m-2"
            onChange={(selectedOptions) => {
              setPlatillosSeleccionados(selectedOptions);
            }}
          />
        </div>
        <div className="flex flex-col w-full mx-2 mb-4">
          {platillosSeleccionados.map((platillo) => (
            <div key={platillo.id} className="flex flex-row items-center mx-2 border-b transition-colors justify-between flex-wrap">
              <div className="flex-shrink-0 p-2 w-full sm:w-full w-2/12">{platillo.nombre} - ${platillo.precio}</div>
              <div className="flex-shrink-0 p-2 w-full sm:w-full w-6/12">
                <Select 
                  options={platillo.extras}
                  getOptionValue={(extra) => extra.nombre}
                  getOptionLabel={(extra) => extra.nombre}
                  isMulti={true}
                  styles={selectStyles}
                  className="w-full"
                />
              </div>
              <div className="flex-shrink-0 p-2 w-full sm:w-full w-4/12">
                <input type="number" min="0" max="10" className="w-full h-8 bg-gray-100 focus:bg-gray-200 outline-none rounded-lg p-2" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full mx-2 p-2">
          <label className="font-semibold text-red-500">Comentarios:</label>
          <textarea className="bg-gray-100 focus:bg-gray-200 outline-none transition-colors p-2 rounded-xl"></textarea>
        </div>
        <div className="flex flex-row justify-center items-center w-full m-4">
          <button className="bg-red-500 hover:bg-red-600 transition-colors text-white rounded-lg font-semibold w-1/2 h-10">Hacer pedido</button>
        </div>
      </div> }
    </div>*/
  );
};

export default nuevoPedido;