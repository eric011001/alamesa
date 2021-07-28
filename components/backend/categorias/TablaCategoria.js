import React from 'react'
import { useQuery,gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Categoria from './Categoria';
import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd';
const OBTENER_CATEGORIAS = gql`
    query Query {
        obtenerCategorias {
            id
            nombre
            orden
        }
    }
`;

const TablaCategorias = () => {
    const router = useRouter();
    const {data,loading,error} = useQuery(OBTENER_CATEGORIAS);
    if (loading) {
        return (
          <div className="ml-6 mt-3 flex flex-grow items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-100" cx="12" cy="12" r="10" stroke="red" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          </div>
        );
    }
    const {obtenerCategorias} = data;

    /*
    <Categoria
                                                categoria = {categoria}
                                                draggableProps = {dragabbleProvided.draggableProps}
                                                dragHandleProps = {dragabbleProvided.dragHandleProps}
                                                referencia = {dragabbleProvided.innerRef}
                                            /> */

    const agregarCategoria = () => {
        console.log("voy a agregar una categoria");
    }
    return (
        <DragDropContext onDragEnd={(result) => console.log(result)}>
            <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
                <div className="h-16 flex justify-left items-center">
                    <h1 className="ml-4 text-2xl font-bold text-red-500">Lista de categorias</h1>
                </div>
                <div className="flex-grow m-8 h-16 overflow-y-auto rounded-xl">
                    <Droppable droppableId="categorias">
                    {(droppableProvided,snapshot) => (
                        <table className="table-auto w-full overflow-y-auto">
                            <thead>
                                <tr className="bg-red-500">
                                <th className="text-white px-4 py-2">Nombre</th>
                                <th className="text-white px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-100" >
                                {obtenerCategorias.map((categoria,index) => (
                                    <Draggable key ={categoria.id} draggableId={categoria.id} index={index}>
                                        {(dragabbleProvided) => (
                                                <tr className="hover:bg-white cursor-default transition-all" {...dragabbleProvided.draggableProps} {...dragabbleProvided.dragHandleProps} ref={dragabbleProvided.innerRef}>
                                                    <td className="px-4 py-2 text-center cursor-default">{categoria.nombre}</td>
                                                    <td className="px-4 py-2 text-center cursor-default">cosas</td>
                                                </tr>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </tbody>
                        </table>
                    )}
                    </Droppable>
                    <button onClick={() => agregarUsuario()} className="bg-red-500 text-white w-16 h-16 rounded-xl transition-all shadow-xl absolute hover:bg-red-600" style={{bottom: '3em', right: '3em'}}>
                        <ion-icon name="person-add-outline" style={{fontSize: '1.5em'}}></ion-icon>
                    </button>
                </div>
            {/* <table>
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>rol</th>
                <th>Activo</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {obtenerUsuarios.map(usuario => (
                <Usuario key={usuario.id} usuario={usuario} />
                ))}
            </tbody>
            </table> */}
            </div>
        </DragDropContext>
    )

}

export default TablaCategorias;