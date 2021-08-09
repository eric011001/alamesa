import React,{useState, useEffect} from 'react'
import {useQuery, gql, useMutation} from "@apollo/client";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Pedido from './Pedido';
import Swal from 'sweetalert2';
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

const ACTUALIZAR_PEDIDO = gql`
  mutation ActualizarPedidoMutation($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      comentario
      estado
      id
      mesa
      
    }
  }
`;

const TablaPedidos = () => {
  const router = useRouter();
  const {data,loading,error,startPolling,stopPolling} = useQuery(OBTENER_PEDIDOS);
  const [pendientes, setPendientes] = useState(null);
  const [preparacion, setPreparacion] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const [ActualizarPedidoMutation] = useMutation(ACTUALIZAR_PEDIDO);
  useEffect(
    () => {
      startPolling(50);
      return () => {
        stopPolling();
      };
    },
    [startPolling, stopPolling]
  );

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

  const {obtenerPedidos} = data;
  const cantidadPendientes = obtenerPedidos.filter(pedido => pedido.estado === "PENDIENTE");
  const cantidadPreparacion = obtenerPedidos.filter(pedido => pedido.estado === "ENPREPARACION" );
  const cantidadEnviado = obtenerPedidos.filter(pedido => pedido.estado === "ENVIADO");

  if (!pendientes || cantidadPendientes.length !== pendientes.length || cantidadPreparacion.length !== preparacion.length || cantidadEnviado.length !== enviado.length) {
    let tempPendientes = []
    let tempPreparacion = []
    let tempEnviado = []

    obtenerPedidos.forEach(pedido => {
      if (pedido.estado === 'PENDIENTE') {
        tempPendientes.push(pedido);
      } else if (pedido.estado === 'ENPREPARACION') {
        tempPreparacion.push(pedido)
      } else if (pedido.estado === 'ENVIADO') {
        tempEnviado.push(pedido);
      }
    })
    setPendientes(tempPendientes);
    setPreparacion(tempPreparacion);
    setEnviado(tempEnviado);
  }

  const agregarPedido = () => {
    router.push("/controlPanel/nuevoPedido");
  }

  return(
    <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
      <div className="h-16 flex justify-left items-center">
        <h1 className="ml-4 text-2xl font-bold text-red-500">Pedidos</h1>
      </div>
      <div className="flex-grow m-8 h-16 flex overflow-x-auto">{/* Pedido, Total, Estado, Comentario, Mesa y Fecha */}
        <DragDropContext onDragEnd={async result=> {
          const {source,destination} = result;
          if(!destination){
            return;
          }
          if (source.index === destination.index && source.droppableId === destination.droppableId) {
            return;
          }
          console.log(result);
          if(source.droppableId === "pendientes"){
            const pedidoCambiado = pendientes[source.index];
            const newPedido = pedidoCambiado.pedido.map(({__typename,...pedido}) => pedido);
            if(destination.droppableId === "preparacion"){
              try {
                const {data} = await ActualizarPedidoMutation({
                  variables:{
                    id: pedidoCambiado.id,
                    input: {
                      comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                      estado: "ENPREPARACION",
                      mesa: pedidoCambiado.mesa,
                      pedido: newPedido,
                      total: pedidoCambiado.total
                    }
                  }
                });
                
              } catch (error) {
                console.log(error);
              }
            } else if (destination.droppableId === "enviado") {
              try {
                const {data} = await ActualizarPedidoMutation({
                  variables:{
                    id: pedidoCambiado.id,
                    input: {
                      comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                      estado: "ENVIADO",
                      mesa: pedidoCambiado.mesa,
                      pedido: newPedido,
                      total: pedidoCambiado.total
                    }
                  }
                })
              } catch (error) {
                console.log(error);
              }
            } else {
              Swal.fire({
                title: '¿Deseas completar este pedido?',
                text: 'El pedido dejara de aparecer en la tabla de pedidos activos',
                icon: 'warning',
                iconColor: '#ef4444',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                reverseButtons: true,
                confirmButtonText: 'Si, completar',
                cancelButtonText: 'No, cancelar'
              }).then(async (result) => {
                if (result.value) {
                  try {
                    const {data} = await ActualizarPedidoMutation({
                      variables:{
                        id: pedidoCambiado.id,
                        input: {
                          comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                          estado: "COMPLETADO",
                          mesa: pedidoCambiado.mesa,
                          pedido: newPedido,
                          total: pedidoCambiado.total
                        }
                      }
                    })
                  } catch (error) {
                    console.log(error);
                  }
                }
              });
            }
          }else if(source.droppableId === "preparacion"){
            const pedidoCambiado = preparacion[source.index];
            const newPedido = pedidoCambiado.pedido.map(({__typename,...pedido}) => pedido);
            if(destination.droppableId === "pendientes"){
              try {
                const {data} = await ActualizarPedidoMutation({
                  variables:{
                    id: pedidoCambiado.id,
                    input: {
                      comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                      estado: "PENDIENTE",
                      mesa: pedidoCambiado.mesa,
                      pedido: newPedido,
                      total: pedidoCambiado.total
                    }
                  }
                })
              } catch (error) {
                console.log(error);
              }
            }else if(destination.droppableId === "enviado"){
              try {
                const {data} = await ActualizarPedidoMutation({
                  variables:{
                    id: pedidoCambiado.id,
                    input: {
                      comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                      estado: "ENVIADO",
                      mesa: pedidoCambiado.mesa,
                      pedido: newPedido,
                      total: pedidoCambiado.total
                    }
                  }
                })
              } catch (error) {
                console.log(error);
              }
            }else{
              Swal.fire({
                title: '¿Deseas completar este pedido?',
                text: 'El pedido dejara de aparecer en la tabla de pedidos activos',
                icon: 'warning',
                iconColor: '#ef4444',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                reverseButtons: true,
                confirmButtonText: 'Si, completar',
                cancelButtonText: 'No, cancelar'
              }).then(async (result) => {
                if (result.value) {
                  try {
                    const {data} = await ActualizarPedidoMutation({
                      variables:{
                        id: pedidoCambiado.id,
                        input: {
                          comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                          estado: "COMPLETADO",
                          mesa: pedidoCambiado.mesa,
                          pedido: newPedido,
                          total: pedidoCambiado.total
                        }
                      }
                    })
                  } catch (error) {
                    console.log(error);
                  }
                }
              });
            }
          }else if(source.droppableId === "enviado"){
            const pedidoCambiado = enviado[source.index];
            const newPedido = pedidoCambiado.pedido.map(({__typename,...pedido}) => pedido);
            if(destination.droppableId === "pendientes"){
              try {
                const {data} = await ActualizarPedidoMutation({
                  variables:{
                    id: pedidoCambiado.id,
                    input: {
                      comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                      estado: "PENDIENTE",
                      mesa: pedidoCambiado.mesa,
                      pedido: newPedido,
                      total: pedidoCambiado.total
                    }
                  }
                })
              } catch (error) {
                console.log(error);
              }
            }else if(destination.droppableId === "preparacion"){
              try {
                const {data} = await ActualizarPedidoMutation({
                  variables:{
                    id: pedidoCambiado.id,
                    input: {
                      comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                      estado: "ENPREPARACION",
                      mesa: pedidoCambiado.mesa,
                      pedido: newPedido,
                      total: pedidoCambiado.total
                    }
                  }
                })
              } catch (error) {
                console.log(error);
              }
            }else{
              Swal.fire({
                title: '¿Deseas completar este pedido?',
                text: 'El pedido dejara de aparecer en la tabla de pedidos activos',
                icon: 'warning',
                iconColor: '#ef4444',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                reverseButtons: true,
                confirmButtonText: 'Si, completar',
                cancelButtonText: 'No, cancelar'
              }).then(async (result) => {
                if (result.value) {
                  try {
                    const {data} = await ActualizarPedidoMutation({
                      variables:{
                        id: pedidoCambiado.id,
                        input: {
                          comentario: pedidoCambiado.comentario ? pedidoCambiado.comentario : "",
                          estado: "COMPLETADO",
                          mesa: pedidoCambiado.mesa,
                          pedido: newPedido,
                          total: pedidoCambiado.total
                        }
                      }
                    })
                  } catch (error) {
                    console.log(error);
                  }
                }
              });
            }
          }
        }}>
        <div className="h-100 w-full sm:w-full md:w-1/2 lg:w-1/4 xl:w-1/4 flex-shrink-0 p-2 flex flex-col">
          <div className="rounded-t-xl bg-red-500 h-12 flex justify-center items-center">
            <h1 className="text-white text-xl font-semibold">Pendiente</h1>
          </div>
          <div className="bg-gray-100 flex-grow rounded-b-xl flex">
            <Droppable
              droppableId="pendientes"
            >
              {(droppableProvider,snapshot) => (
                <ul className="mt-4 px-2 w-full" {...droppableProvider.droppableProps} ref={droppableProvider.innerRef} >
                  {
                    pendientes.map((pedido, index) => (
                      <Draggable key={pedido.id} draggableId={pedido.id} index={index}>
                        {(draggableProvider) => (
                          <li {...draggableProvider.draggableProps} ref={draggableProvider.innerRef} {...draggableProvider.dragHandleProps}>
                            <Pedido pedido={pedido}/>
                          </li>
                        )}
                      </Draggable>
                    ))
                  }
                  {droppableProvider.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
        <div className="h-100 w-full sm:w-full md:w-1/2 lg:w-1/4 xl:w-1/4 flex-shrink-0 p-2 flex flex-col">
          <div className="rounded-t-xl bg-red-500 h-12 flex justify-center items-center">
            <h1 className="text-white text-xl font-semibold">Preparación</h1>
          </div>
          <div className="bg-gray-100 flex-grow rounded-b-xl flex">
            <Droppable
              droppableId="preparacion"
            >
              {(droppableProvider,snapshot) => (
                <ul className="mt-4 px-2 w-full" {...droppableProvider.droppableProps} ref={droppableProvider.innerRef} >
                  {
                    preparacion.map((pedido, index) => (
                      <Draggable key={pedido.id} draggableId={pedido.id} index={index}>
                        {(draggableProvider) => (
                          <li {...draggableProvider.draggableProps} ref={draggableProvider.innerRef} {...draggableProvider.dragHandleProps}>
                            <Pedido pedido={pedido}/>
                          </li>
                        )}
                      </Draggable>
                    ))
                  }
                  {droppableProvider.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
        <div className="h-100 w-full sm:w-full md:w-1/2 lg:w-1/4 xl:w-1/4 flex-shrink-0 p-2 flex flex-col">
          <div className="rounded-t-xl bg-red-500 h-12 flex justify-center items-center">
            <h1 className="text-white text-xl font-semibold">Enviado</h1>
          </div>
          <div className="bg-gray-100 flex-grow rounded-b-xl flex">
            <Droppable
              droppableId="enviado"
            >
              {(droppableProvider,snapshot) => (
                <ul className="mt-4 px-2 w-full" {...droppableProvider.droppableProps} ref={droppableProvider.innerRef} >
                  {
                    enviado.map((pedido, index) => (
                      <Draggable key={pedido.id} draggableId={pedido.id} index={index}>
                        {(draggableProvider) => (
                          <li {...draggableProvider.draggableProps} ref={draggableProvider.innerRef} {...draggableProvider.dragHandleProps}>
                            <Pedido pedido={pedido}/>
                          </li>
                        )}
                      </Draggable>
                    ))
                  }
                  {droppableProvider.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
        <div className="h-100 w-full sm:w-full md:w-1/2 lg:w-1/4 xl:w-1/4 flex-shrink-0 p-2 flex flex-col">
          <div className="rounded-t-xl bg-red-500 h-12 flex justify-center items-center">
            <h1 className="text-white text-xl font-semibold">Completado</h1>
          </div>
          <div className="bg-gray-100 flex-grow rounded-b-xl flex">
            <Droppable
              droppableId="completado"
            >
              {(droppableProvider,snapshot) => (
                <ul className="mt-4 px-2 w-full" {...droppableProvider.droppableProps} ref={droppableProvider.innerRef} >
                  
                  {droppableProvider.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
        </DragDropContext>
        <button onClick={() => agregarPedido()} className="bg-red-500 text-white w-16 h-16 rounded-xl transition-all shadow-xl absolute hover:bg-red-600 p-3" style={{bottom: '3em', right: '3em'}}>
          <ion-icon name="copy-outline" style={{fontSize: '1.5em'}}></ion-icon>
        </button>
      </div>
    </div>
  )
}

export default TablaPedidos;