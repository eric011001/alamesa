import React, { useState, useEffect } from 'react'
import { gql,useQuery,useMutation } from "@apollo/client";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/router';
import Swal from "sweetalert2";
import Select from "react-select";
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';

const NUEVO_PEDIDO = gql`
    mutation CrearPedidoMutation($input: PedidoInput) {
        crearPedido(input: $input) {
            comentario
            estado
        }
    }
`;

const OBTENER_PEDIDOS = gql`
  query Query {
    obtenerPedidos {
      id
      comentario
      estado
      mesa
      pedido {
        cantidad
        nombre
        precio
        __typename
      }
      total
      __typename
    }
  }
`;

const OBTENER_MESAS = gql`
  query Query {
    obtenerMesas {
        id
        nombre
    }
  }
`

const OBTENER_PLATILLOS = gql`
    query Query {
        obtenerPlatillos {
            id
            descripcion
            nombre
            precio
            disponible
            categoria {
            nombre
            }
        }
    }
`;

const nuevoPedido = () => {
    const router = useRouter();
    const [mensaje, guardarMensaje] = useState(null);
    const [mesa, setMesa] = useState(null);
    const [pedido, setPedido] = useState([])
    const [CrearPedidoMutation] = useMutation(NUEVO_PEDIDO,{
        update(cache, { data: { crearPedido } }) {
            const { obtenerPedidos } = cache.readQuery({ query: OBTENER_PEDIDOS });
            cache.writeQuery({
              query: OBTENER_PEDIDOS,
              data: {
                obtenerPedidos: [...obtenerPedidos, crearPedido]
              }
            })
        }
    })

    const {data,loading,error} = useQuery(OBTENER_MESAS);
    const {data: dataPlatillos, loading:loadingPlatillos, error: errorPlatillo} = useQuery(OBTENER_PLATILLOS);
    const formikPedido = useFormik({
        initialValues: {
            comentarioInput: '',
            mesaInput: ''
        },
        validationSchema: Yup.object({
            comentarioInput: Yup.string(),
            mesaInput: Yup.string().required("la mesa es necesaria")
        }),
        onSubmit: async valores => {
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

    if (loading || loadingPlatillos) {
      return(
          <div className="ml-6 mt-3 flex flex-grow items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-100" cx="12" cy="12" r="10" stroke="red" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div> 
      )
    }
    const {obtenerMesas} = data;
    const {obtenerPlatillos} = dataPlatillos;
    console.log(obtenerPlatillos);
    return(
        <div className="flex">
            <HeadApp/>
            <Menu/> 
            <form onSubmit={formikPedido.handleSubmit} className="flex w-full">
              <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
                <div className="h-16 flex justify-left items-center">
                  <h1 className="ml-4 text-2xl font-bold text-red-500">Agregar pedido </h1>
                </div>
                <div className="flex-grow m-8 flex flex-col">
                  <div className="flex flex-wrap">
                    <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full flex-shrink-0 flex flex-col">
                      <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="mesaInput">Mesa:</label>
                      <Select id="mesaInput"
                        options={obtenerMesas}
                        getOptionValue={(mesa) => mesa.nombre}
                        getOptionLabel={(mesa) => mesa.nombre}
                        onChange={selectedOption => {
                        formikPedido.handleChange('mesaInput')(selectedOption.nombre); 
                        setMesa(selectedOption);}} onBlur={formikPedido.handleBlur} value={mesa} className="m-2" styles={selectStyles}
                      />
                      {formikPedido.touched.rolInput && formikPedido.errors.rolInput ? (
                        <span className="bg-white justify-center flex text-red-500">{formikPedido.errors.rolInput}</span>
                      ): null}
                    </div>
                    <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full flex-shrink-0 flex flex-col">
                      <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="pedidoInput">Pedido:</label>
                      <Select id="pedidoInput"
                        options={obtenerPlatillos}
                        getOptionValue={(platillo) => platillo.nombre}
                        getOptionLabel={(platillo) => platillo.nombre}
                        isMulti={true}
                        onChange={selectedOption => {
                        setPedido(selectedOption);}} value={pedido} className="m-2" styles={selectStyles}
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
            </form>
        </div>
    )
}



export default nuevoPedido;