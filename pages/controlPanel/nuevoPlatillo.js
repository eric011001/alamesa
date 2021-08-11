import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import Select from 'react-select';
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';

const OBTENER_CATEGORIAS = gql`
  query Query {
    obtenerCategorias {
      id
      nombre
      orden
    }
  }
`;
const NUEVO_PLATILLO = gql`
  mutation CrearPlatilloMutation($input: PlatilloInput!) {
    crearPlatillo(input: $input) {
      
      descripcion
      disponible
      extras {
        nombre
        precio
      }
      id
      nombre
      precio
    }
  }
`;

// const NUEVO_PLATILLO = gql`mamadas de graphql`;

const disponibleOptions = [
  { value: "si", label: 'Sí' },
  { value: "no", label: 'No' }
];

const categoriaOptions = [
  // Aqui va algo que no se como se hace 
]

const nuevoPlatillo = () => {
  const { data, loading, error } = useQuery(OBTENER_CATEGORIAS);
  const [disponible, setDisponible] = useState([]);
  const [categoria, setCategoria] = useState(null)
  const [mensaje, guardarMensaje] = useState(null);
  const [extras, setExtras] = useState([]);
  const inputNombreExtra = useRef(null);
  const inputPrecioExtra = useRef(null);
  const [CrearPlatilloMutation] = useMutation(NUEVO_PLATILLO);
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
      disponibleInput: '',
      categoriaInput: '',
      descripcionInput: ''
    },
    validationSchema: Yup.object({
      nombreInput: Yup.string().required('El nombre es necesario'),
      precioInput: Yup.number().required('El precio es necesario').min(0),
      disponibleInput: Yup.string().required('La disponibilidad es necesaria'),
      categoriaInput: Yup.string().required('La categoria es necesaria'),
      descripcionInput: Yup.string()
    }),
    onSubmit: async (valores) => {
      const {nombreInput,precioInput,disponibleInput,categoriaInput,descripcionInput} = valores;
      let disponibles = true;
      if(disponibleInput === "no"){
        disponibles = false;
      }
      try {
        const {data} = await CrearPlatilloMutation({
          variables: {
            input: {
              nombre: nombreInput,
              precio: precioInput,
              disponible:disponibles,
              categoria: categoriaInput,
              descripcion: descripcionInput,
              extras: extras
            }
          }
        })
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'se creó el platillo exitosamente',
          confirmButtonColor: '#ef4444'
        })
        router.push('/controlPanel/platillos')
      } catch (error) {
        log
        guardarMensaje(error.message.replace('GraphQL error: ', ''));
        setTimeout(() => {
          guardarMensaje(null);
        }, 2500);
      }
    }
  });

  if (loading) {
    return (
      'Cargando...'
    )
  }


  const { obtenerCategorias } = data;

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

  const agregarExtra = () => {
    
    if (inputNombreExtra.current.value && inputPrecioExtra.current.value) {
      const tempExtras = [...extras];
      tempExtras.push({
        nombre: inputNombreExtra.current.value,
        precio: parseInt(inputPrecioExtra.current.value)
      });
      setExtras(tempExtras);
      inputNombreExtra.current.value = '';
      inputPrecioExtra.current.value = 0 
    } else {
      console.log('Rellenele verga');
    }
  };

  const eliminarExtra = (index) => {
    const tempExtras = [...extras];

    tempExtras.splice(index, 1);
    setExtras(tempExtras);
  };

  return (
    <div className="flex">
      <HeadApp />
      <Menu />
      <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
        <div className="h-16 flex justify-left items-center">
          <h1 className="ml-4 text-2xl font-bold text-red-500">Agregar platillo</h1>
        </div>
        <div className="flex-grow m-8 flex flex-col">
          <form onSubmit={formikPlatillo.handleSubmit}>
            <div className="flex flex-wrap">
              <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="nombreInput">Nombre:</label>
                <input type="text" id="nombreInput" name="nombreInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" onChange={formikPlatillo.handleChange} onBlur={formikPlatillo.handleBlur} value={formikPlatillo.values.nombreInput}/>
              </div>
              <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="precioInput">Precio:</label>
                <input type="number" id="precioInput" name="precioInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" onChange={formikPlatillo.handleChange} onBlur={formikPlatillo.handleBlur} value={formikPlatillo.values.precioInput} />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="disponibleInput">Disponible:</label>
                <Select id="disponibleInput" options={disponibleOptions} className="m-2" styles={selectStyles}
                    onChange={selectedOption => {
                    formikPlatillo.handleChange('disponibleInput')(selectedOption.value); 
                    setDisponible(selectedOption);}} onBlur={formikPlatillo.handleBlur}
                    value={disponible}
                />
              </div>
              <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="categoriaInput">Categoría:</label>
                <Select
                  id="categoriaInput"
                  options={obtenerCategorias}
                  getOptionValue={(categoria) => categoria.id}
                  getOptionLabel={(categoria) => categoria.nombre}
                  className="m-2"
                  styles={selectStyles}
                  onChange={selectedOption => {
                    formikPlatillo.handleChange('categoriaInput')(selectedOption.id); 
                    setCategoria(selectedOption);}} onBlur={formikPlatillo.handleBlur}
                    value={categoria}
                  />
              </div>
              <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="extrasInput">Extras:</label>
                <div className="flex flex-row">
                  <input type="text" ref={inputNombreExtra} className="p-2 m-2 w-2/6 sm:w-5/12 h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-colors" placeholder="Nombre"/>
                  <input type="number" ref={inputPrecioExtra} className="p-2 m-2 w-2/6 sm:w-5/12 h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-colors" placeholder="Precio"/>
                  <button type="button" className="bg-red-500 focus:bg-red-600 h-10 w-10 m-2 pt-1 text-2xl text-white rounded-lg outline-none transition-colors" onClick={() => agregarExtra()}>
                    <ion-icon name="add-circle-outline"></ion-icon>
                  </button>
                </div>
                <div className="">
                  {extras.map((extra, index) => { return(<span key={index} onClick={() => eliminarExtra(index)} className="bg-gray-200 px-1 m-1 rounded cursor-pointer"><small>{extra.nombre}</small></span>)})}
                  
                </div>
              </div>

            </div>
            <div className="flex flex-wrap">
              <div className="w-full flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-3 mr-2 block" htmlFor="descripcionInput">Descripción:</label>
                <textarea className="p-2 m-2 w-auto block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-colors" id="descripcionInput"  onChange={formikPlatillo.handleChange} onBlur={formikPlatillo.handleBlur} value={formikPlatillo.values.descripcionInput} ></textarea>
              </div>
            </div>
            <div className="flex flex-wrap justify-center">
              <button type="submit" className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">Agregar platillo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default nuevoPlatillo;