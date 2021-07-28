import React, { useState } from 'react'
import { gql, useQuery, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Select from "react-select";
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';


const NUEVO_USUARIO = gql`
    mutation CrearNuevoUsuarioMutation($input: UsuarioInput!) {
        crearNuevoUsuario(input: $input) {
            nombre
            id
            email
        }
    }
`;
const OBTENER_USUARIOS = gql`
    query Query {
        obtenerUsuarios {
            nombre
            apellidos
            email
            id
            rol
            status
        }
    }
`;


const rolOptions = [
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'USUARIO', lable: 'Usuario' }
];

const statusOptions = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' }
];

const nuevoUsuario = () => {
  const router = useRouter();
  const [status, setStatus] = useState([]);
  const [rol, setRol] = useState([]);
  const [mensaje, guardarMensaje] = useState(null);


  const [CrearNuevoUsuarioMutation] = useMutation(NUEVO_USUARIO, {
    update(cache, { data: { nuevoUsuario } }) {
      const { obtenerUsuarios } = cache.readQuery({ query: OBTENER_USUARIOS });

      cache.writeQuery({
        query: OBTENER_USUARIOS,
        data: {
          obtenerUsuarios: [...obtenerUsuarios, nuevoUsuario]
        }
      })
    }
  });

  const formikUsuario = useFormik({
    initialValues: {
      nombreInput: '',
      apellidosInput: '',
      emailInput: '',
      passwordInput: '',
      rolInput: '',
      statusInput: '',
    },
    validationSchema: {
      nombreInput: Yup.string().required("El nombre es necesario"),
      apellidosInput: Yup.string().required("EL apellido es necesario"),
      emailInput: Yup.string().required("El email es necesario").email("El correo no es valido"),
      passwordInput: Yup.string().required("La contraseña es necesaria"),
      rolInput: Yup.string().required("El rol es necesario"),
      statusInput: Yup.string().required("El estado es necesario")
    },
    onSubmit: async valores => {
      console.log(valores);
      const { nombreInput, apellidosInput, emailInput, passwordInput, rolInput, statusInput } = valores;
      try {
        const { data } = await CrearNuevoUsuarioMutation({
          variables: {
            input: {
              nombre: nombreInput,
              apellidos: apellidosInput,
              email: emailInput,
              password: passwordInput,
              rol: rolInput,
              status: statusInput
            }
          }
        })
        Swal.fire(
          'Creado',
          'Se creó el usuario exitosamente',
          'success'
        );

      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error: ', ''));
        setTimeout(() => {
          guardarMensaje(null);
        }, 2500);
      }
    }
  })

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
  }

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


  return (
    <div className="flex">
      <HeadApp />
      <Menu />
      <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
        <div className="h-16 flex justify-left items-center">
          <h1 className="ml-4 text-2xl font-bold text-red-500">Agregar usuario</h1>
        </div>
        <div className="flex-grow m-8 flex flex-col">
          <div className="flex flex-wrap">
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="nombreInput">Nombre:</label>
              <input type="text" id="nombreInput" name="nombreInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikUsuario.handleChange} onBlur={formikUsuario.handleBlur} value={formikUsuario.values.nombreInput}/>
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="apellidosInput">Apellidos:</label>
              <input type="text" id="apellidosInput" name="apellidosInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikUsuario.handleChange} onBlur={formikUsuario.handleBlur} value={formikUsuario.values.apellidosInput}/>
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
            <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="emailInput">Correo electrónico:</label>
              <input type="email" id="emailInput" name="emailInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikUsuario.handleChange} onBlur={formikUsuario.handleBlur} value={formikUsuario.values.emailInput}/>
            </div>
          </div>
          <div className="flex flex-wrap ">
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="passwordInput">Contraseña:</label>
              <input type="password" id="passwordInput" name="passwordInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={formikUsuario.handleChange} onBlur={formikUsuario.handleBlur} value={formikUsuario.values.passwordInput}/>
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="rolInput">Rol:</label>
              <Select id="rolInput" options={rolOptions} onChange={selectedOption => {
                formikUsuario.handleChange('rolInput')(selectedOption.value); 
                setRol(selectedOption);}} onBlur={formikUsuario.handleBlur} value={rol} className="m-2" styles={selectStyles}/>
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="statusInput">Status:</label>
              <Select id="statusInput" options={statusOptions} onChange={selectedOption => {formikUsuario.handleChange('statusInput')(selectedOption.value); setStatus(selectedOption);}} onBlur={formikUsuario.handleBlur} value={status} className="m-2" styles={selectStyles}/>
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            <button type="submit" className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">Agregar usuario</button>
          </div>
        </div>
      </div>
    </div>
  )

}

export default nuevoUsuario;