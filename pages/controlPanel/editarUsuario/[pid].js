import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { useQuery,gql,useMutation } from '@apollo/client';
import HeadApp from '../../../components/Head';
import Menu from '../../../components/menu/Menu';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Select from "react-select";
const OBTENER_USUARIO = gql`
    query Query($id: ID!) {
        obtenerUsuario(id: $id) {
            nombre
            apellidos
            email
            id
            rol
            status
        }
    }
`;

const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuarioMutation($id: ID!, $input: ActualizarUsuarioInput) {
    actualizarUsuario(id: $id, input: $input) {
      apellidos
      email
      id
      nombre
      rol
      status
      __typename
    }
  }
`;

const rolOptions = [
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'USUARIO', label: 'Usuario' }
];
  
const statusOptions = [
{ value: 'ACTIVO', label: 'Activo' },
{ value: 'INACTIVO', label: 'Inactivo' }
];

const editarUsuario = () => {
    const router = useRouter();
    const {query: {pid: id}} = router;
    const [status, setStatus] = useState(null);
    const [rol, setRol] = useState(null);
    const [mensaje, guardarMensaje] = useState(null);

    const [ActualizarUsuarioMutation] = useMutation(ACTUALIZAR_USUARIO);
    const {data,loading,error} = useQuery(OBTENER_USUARIO,{
        variables:{
            id: id ? id : ""
        }
    });

    

    const schemaValidation = Yup.object({
        nombreInput: Yup.string().required("El nombre es necesario"),
        apellidosInput: Yup.string().required("El apellido es necesario"),
        emailInput: Yup.string().required("El correo es necesario").email("El correo no es valido"),
        passwordInput: Yup.string().required("La contraseña es necesaria"),
        confirmPasswordInput: Yup.string().required("La confirmación es necesaria"),
        rolInput: Yup.string().required("El rol es necesario"),
        statusInput: Yup.string().required("El estado es necesario")
    });

    if(loading || !data){
       return (
           <p>S</p>
       )
    }

    const actualizaElUsuario = async (valores) => {
      const {nombreInput, apellidosInput, emailInput, passwordInput, confirmPasswordInput, rolInput, statusInput} = valores;
      try {
        const { data } = await ActualizarUsuarioMutation({
          variables:{
            id,
            input: {
              nombre: nombreInput,
              apellidos: apellidosInput,
              email: emailInput,
              password: passwordInput,
              confirmPassword: confirmPasswordInput,
              rol: rolInput,
              status: statusInput
            }
          }
        });
        Swal.fire(
          'Actualizado',
          'El usuario se actualizo correctamente',
          'success'
        );
        router.push("/controlPanel/usuarios")
      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error: ', ''));
        setTimeout(() => {
          guardarMensaje(null);
        }, 2500);
      }
    }

    const {obtenerUsuario} = data;
    const usuario = {
        nombreInput: obtenerUsuario.nombre,
        apellidosInput: obtenerUsuario.apellidos,
        emailInput: obtenerUsuario.email,
        passwordInput: '',
        confirmPasswordInput: '',
        rolInput: obtenerUsuario.rol,
        statusInput: obtenerUsuario.status
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

    if(!rol){
      if(obtenerUsuario.rol === "ADMINISTRADOR"){
        setRol({ value: 'ADMINISTRADOR', label: 'Administrador' })
      }else{
        setRol({ value: 'USUARIO', label: 'Usuario' })
      }
    }

    if(!status){
      if(obtenerUsuario.status === "ACTIVO"){
        setStatus({ value: 'ACTIVO', label: 'Activo' })
      }else{
        setStatus({ value: 'INACTIVO', label: 'Inactivo' })
      }
    }

    return(
        <div className="flex">
            <HeadApp/>
            <Menu/>
            <Formik
                enableReinitialize
                initialValues= {usuario}
                validationSchema = {schemaValidation}
                onSubmit = {valores => {
                    console.log(valores);
                }}
            >
                {props => {
                    return(
                        <form onSubmit={props.handleSubmit} className="flex w-full">
      <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
        <div className="h-16 flex justify-left items-center">
          <h1 className="ml-4 text-2xl font-bold text-red-500">editar usuario</h1>
        </div>
        <div className="flex-grow m-8 flex flex-col">
          <div className="flex flex-wrap">
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="nombreInput">Nombre:</label>
              <input type="text" id="nombreInput" name="nombreInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.nombreInput}/>
              {props.touched.nombreInput && props.errors.nombreInput ? (
                <span className="bg-white justify-center flex text-red-500">{props.errors.nombreInput}</span>
              ): null}
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="apellidosInput">Apellidos:</label>
              <input type="text" id="apellidosInput" name="apellidosInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.apellidosInput}/>
              {props.touched.apellidosInput && props.errors.apellidosInput ? (
                <span className="bg-white justify-center flex text-red-500">{props.errors.apellidosInput}</span>
              ): null}
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="emailInput">Correo electrónico:</label>
              <input type="email" id="emailInput" name="emailInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.emailInput}/>
              {props.touched.emailInput && props.errors.emailInput ? (
                <span className="bg-white justify-center flex text-red-500">{props.errors.emailInput}</span>
              ): null}
            </div>
          </div>
          <div className="flex flex-wrap ">
            <div className="w-full sm:w-full md:w-full lg:w-1/4 xl:w-1/4 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="passwordInput">Contraseña:</label>
              <input type="password" id="passwordInput" name="passwordInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.passwordInput}/>
              {props.touched.passwordInput && props.errors.passwordInput ? (
                <span className="bg-white justify-center flex text-red-500">{props.errors.passwordInput}</span>
              ): null}
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/4 xl:w-1/4 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="confirmPasswordInput">Confirmar contraseña:</label>
              <input type="password" id="confirmPasswordInput" name="confirmPasswordInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none transition-all rounded-xl" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.confirmPasswordInput}/>
              {props.touched.confirmPasswordInput && props.errors.confirmPasswordInput ? (
                <span className="bg-white justify-center flex text-red-500">{props.errors.confirmPasswordInput}</span>
              ): null}
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/4 xl:w-1/4 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="rolInput">Rol:</label>
              <Select id="rolInput" options={rolOptions} onChange={selectedOption => {
                props.handleChange('rolInput')(selectedOption.value); 
                setRol(selectedOption);}} onBlur={props.handleBlur} value={rol} className="m-2" styles={selectStyles}/>
              {props.touched.rolInput && props.errors.rolInput ? (
                <span className="bg-white justify-center flex text-red-500">{props.errors.rolInput}</span>
              ): null}
            </div>
            <div className="w-full sm:w-full md:w-full lg:w-1/4 xl:w-1/4 flex-shrink-0 flex flex-col">
              <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="statusInput">Status:</label>
              <Select id="statusInput" options={statusOptions} onChange={selectedOption => {props.handleChange('statusInput')(selectedOption.value); setStatus(selectedOption);}} onBlur={props.handleBlur} value={status} className="m-2" styles={selectStyles}/>
              {props.touched.statusInput && props.errors.statusInput ? (
                <span className="bg-white justify-center flex text-red-500">{props.errors.statusInput}</span>
              ): null}
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            <button type="submit" className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">actualizar usuario</button>
          </div>
        </div>
      </div>
      </form>
                    )
                }}

            </Formik>
        </div>
    )
}

export default editarUsuario;