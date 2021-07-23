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
const StatusOptions = [
    {value: "ACTIVO", label: "Activo"},
    {value: "INACTIVO", label: "Inactivo"}
]

const RolOptions = [
    {value: "ADMINISTRADOR", label: "Administrador"},
    {value: "USUARIO", lable: "Usuario"}
]

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
            rolInput: '',
            statusInput: '',
        },
        validationSchema: {
            nombreInput: Yup.string().required("El nombre es necesario"),
            apellidosInput: Yup.string().required("EL apellido es necesario"),
            emailInput: Yup.string().required("El email es necesario").email("El correo no es valido"),
            rolInput: Yup.string().required("El rol es necesario"),
            statusInput: Yup.string().required("El estadio es necesario")
        },
        onSubmit: async valores => {
            console.log(valores);
            const {nombreInput, apellidosInput, emailInput, rolInput, statusInput} = valores;
            try {
                const {data} = await CrearNuevoUsuarioMutation({
                    variables: {
                        input: {
                            nombre: nombreInput,
                            apellidos: apellidosInput,
                            email: emailInput,
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
        return (
          <p>{mensaje}</p>
        )
    };

    const selectStyles = {
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#F0F2F5' : 'white',
          color: '#212529',
        }),
        control: (provided, state) => ({
          ...provided,
          borderRadius: '1.2em',
          backgroundColor: state.isFocused ? '#e1e3e6' : '#F0F2F5',
          borderWidth: '1px'
        }),
        menuList: (provided, state) => ({
          ...provided,
          borderRadisu: '1.2em'
        })
    };

    
    return(
        <>
            <HeadApp/>
            <Menu/>
            <div className="borde ml-24 ">
                
                <p>Aquí va todo el form</p>
            </div>
        </>
        )
    
}

export default nuevoUsuario;