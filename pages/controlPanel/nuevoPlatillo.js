import React, { useState } from 'react';
import { useFormik  } from 'formik';
import * as Yup from 'yup';
import { gql, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import Select from 'react-select';
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';

// const NUEVO_PLATILLO = gql`mamadas de graphql`;

const disponibleOptions = [
  { value: true, label: 'Sí' },
  { value: false, label: 'No' }
];

const categoriaOptions = [
  // Aqui va algo que no se como se hace 
]

const nuevoPlatillo = () => {

  const [disponible, setDisponible] = useState([]);
  const [mensaje, guardarMensaje] = useState(null);

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

  const formikPlatillo = useFormik({
    initialValues: {
      nombreInput: '',
      precioInput: 0,
      disponibleInput: true,
      categoriaInput: ''
    },
    validationSchema: {
      nombreInput: Yup.string().required('El nombre es necesario'),
      precioInput: Yup.number().required('El precio es necesario').min(0),
      disponibleInput: Yup.bool().required('La disponibilidad es necesaria'),
      categoriaInput: Yup.string().required('La categoria es necesaria')
    },
    onSubmit: async (valores) => {
      console.log(valores);
    }
  });

  const mostrarMensaje = () => {
    const spinner = <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-100" cx="12" cy="12" r="10" stroke="red" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>;
    return (
      <span className="block w-full flex justify-center items-center p-2 m-2 bg-gray-200 text-red-600 font-semibold rounded-xl">
        {mensaje === 'Procesando...' ? (spinner) : null}
        {mensaje}
      </span>
    )
  };
 
  return (
    <div className="flex">
      <HeadApp />
      <Menu />
      <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
        Pedic
        <div className="h-16 flex justify-left items-center">
          <h1 className="ml-4 text-2xl font-bold text-red-500">Agregar platillo</h1>
        </div>
        <div className="flex-grow m-8 flex flex-col">
          <div className="flex flex-wrap">
            <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="nombreInput">Nombre:</label>
              <input type="text" id="nombreInput" name="nombreInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" />
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="precioInput">Precio:</label>
              <input type="number" id="precioInput" name="precioInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="disponibleInput">Disponible:</label>
              <Select id="disponibleInput" options={disponibleOptions} className="m-2" styles={selectStyles}  />
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="categoriaInput">Categoría:</label>
              <Select id="categoriaInput" options={[]} className="m-2" styles={selectStyles}  />
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            <button type="submit" className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">Agregar usuario</button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default nuevoPlatillo;