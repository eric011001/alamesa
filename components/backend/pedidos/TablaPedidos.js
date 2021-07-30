import React,{useState} from 'react'
import {useQuery, gql} from "@apollo/client";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Pedido from './Pedido';

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

const TablaPedidos = () => {
  const {data,loading,error} = useQuery(OBTENER_PEDIDOS);
  const [pendientes, setPendientes] = useState(null);
  const [preparacion, setPreparacion] = useState(null);
  const [enviado, setEnviado] = useState(null);
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

  if (!pendientes) {
    let tempPendientes = []
    let tempPreparacion = []
    let tempenviado = []

    obtenerPedidos.forEach(pedido => {
      if (pedido.estado === "PENDIENTE") {
        tempPendientes.push(pedido);
      } else if (pedido.estado === "EN PREPARACION") {
        tempPreparacion.push(pedido);
      } else if (pedido.estado === "ENVIADO") {
        tempenviado.push(pedido);
      }
    })
    setPendientes(tempPendientes);
    setPreparacion(tempPreparacion);
    setEnviado(tempenviado);
  }

  return(
    <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
      <div className="h-16 flex justify-left items-center">
        <h1 className="ml-4 text-2xl font-bold text-red-500">Pedidos</h1>
      </div>
      <div className="flex-grow m-8 h-16 flex overflow-x-auto">{/* Pedido, Total, Estado, Comentario, Mesa y Fecha */}
        <DragDropContext onDragEnd={result=> {
          const {source,destination} = result;
          if(!destination){
            return;
          }
          if (source.index === destination.index && source.droppableId === destination.droppableId) {
            return;
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
            
          </div>
        </div>
        </DragDropContext>
      </div>
    </div>
  )
}

export default TablaPedidos;