import React, { useState, useEffect } from 'react'
import { gql,useQuery,useMutation } from "@apollo/client";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/router';
import Swal from "sweetalert2";
import Select from "react-select";
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';
import TablaCategorias from '../../components/backend/pedidos/TablaCategorias';
import TablaPlatillos from '../../components/backend/pedidos/TablaPlatillos';
import PlatilloRegistrado from '../../components/backend/pedidos/PlatilloRegistrado';

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
        obtenerPlatillosDisponibles {
            id
            descripcion
            nombre
            precio
            disponible
            categoria {
            nombre
            id
            }
            extras {
              nombre
              precio
            }
        }
    }
`;

const OBTENER_CATEGORIAS = gql`
  query Query {
    obtenerCategorias {
      id
      nombre
      orden
    }
  }
`;

const nuevoPedido = () => {
    const router = useRouter();
    const [mensaje, guardarMensaje] = useState(null);
    const [categoriaActual, setCategoriaActual] = useState(null);
    const [mesa, setMesa] = useState(null);
    const [pedido, setPedido] = useState([]);
    const [comentario, setComentario] = useState("")
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
    const {data: dataCategorias, loading: loadingCategorias, error: errorCategorias} = useQuery(OBTENER_CATEGORIAS);
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

    if (loading || loadingPlatillos || loadingCategorias) {
      return (
        'Cargando...'
      )
    }

    
    const {obtenerMesas} = data;
    const {obtenerPlatillosDisponibles} = dataPlatillos;
    const {obtenerCategorias} = dataCategorias;    


    const registrarPedido = async () => {
      const lastPedido = pedido.map(({__typename,categoria,id,descripcion,disponible,extras,...servicio})=>servicio);
      
      if(!mesa){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'favor de seleccionar una mesa',
          confirmButtonColor: '#ef4444'
        })
        return;
      }
      if(pedido.length === 0){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se ha ordenado nada',
          confirmButtonColor: '#ef4444'
        })
        return;
      }
      let total = 0;
      let newPedido = [];
      lastPedido.forEach(pedidoActual => {
        newPedido.push({
          nombre: pedidoActual.nombre,
          extras: pedidoActual.pedidoExtras,
          cantidad: pedidoActual.cantidad,
          precio: pedidoActual.platilloTotal
        });
        total += pedidoActual.platilloTotal;
      });
      try {
        const {data} = await CrearPedidoMutation({
          variables:{
            input: {
              mesa: mesa.nombre,
              comentario,
              pedido: newPedido,
              total,
              estado: "PENDIENTE"
            }
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'se creó el pedido exitosamente',
          confirmButtonColor: '#ef4444'
        })
        router.push('/controlPanel/pedidos')
      } catch (error) {
        console.log(error);
      }
      
    }

    const agregaPlatillo = (platillo) => {
      
      const nuevoPlatillo = {
        ...platillo,
        pedidoExtras: Array(1),
        cantidad:1,
        platilloTotal: platillo.precio
      }
      console.log(nuevoPlatillo);
      setPedido((pedidoActual) => [...pedidoActual,nuevoPlatillo]);
      setCategoriaActual(null);
    }
    return(
        <div className="flex">
            <HeadApp/>
            <Menu/> 
            <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
              <div className="h-16 flex justify-left items-center">
                <h1 className="ml-4 text-2xl font-bold text-red-500">Agregar pedido </h1>
              </div>
              <div className="xl:flex">
                <div className="flex-grow m-8 xl:w-3/5 sm:full flex flex-col">
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
                      <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" >Pedido:</label>
                      <div class="grid  ml-4 xl:grid-cols-4 sm:grid-cols-2 gap-4 mb-5">
                        <TablaCategorias categorias = {obtenerCategorias} setCategoriaActual={setCategoriaActual}/>
                      </div>
                      {
                        categoriaActual ? (
                          <div class="grid  ml-4 xl:grid-cols-4 sm:grid-cols-2 gap-4">
                            <TablaPlatillos platillos = {obtenerPlatillosDisponibles} idCategoria = {categoriaActual} agregaPlatillo = {agregaPlatillo}/>
                          </div>
                        ): (null)
                      }
                      
                    </div>
                    
                    <div className="flex flex-wrap w-full">
                      <div className="w-full flex-shrink-0 flex flex-col">
                        <label className="font-semibold mt-2 mb-2 ml-3 mr-2 block" htmlFor="comentarioInput">Comentarios:</label>
                        <textarea  onChange={(e) => setComentario(e.target.value)} value={comentario} className="p-2 m-2 w-auto block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-colors" id="comentarioInput" ></textarea>
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap justify-center">
                      <button type="button" onClick={() => registrarPedido()} className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">Agregar Pedido</button>
                    </div>
                  </div>
                </div>
                <div className="flex-grow m-8 xl:w-2/5 md:w-full flex flex-col">
                  <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full flex-shrink-0 flex flex-col">
                      <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block">Resumen:</label>
                      <div className="flex flex-col w-full mx-2  mb-4 ">
                        {pedido.map((platillo) => (
                          <PlatilloRegistrado key={platillo.id} platillo={platillo} pedido ={pedido} setPedido={setPedido}/>
                        ))}
                      </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    )
}



export default nuevoPedido;