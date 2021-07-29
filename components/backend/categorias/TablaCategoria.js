import React, {useState, useEffect} from 'react'
import { useQuery,gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Categoria from './Categoria';
import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd';
import Swal from "sweetalert2";
const OBTENER_CATEGORIAS = gql`
    query Query {
        obtenerCategorias {
            id
            nombre
            orden
        }
    }
`;

const NUEVA_CATEGORIA = gql`
    mutation CrearNuevaCategoriaMutation($input: CategoriaInput!) {
        crearNuevaCategoria(input: $input) {
            id
            nombre
            orden
            __typename
        }
    }
`;

const TablaCategorias = () => {
    const router = useRouter();
    const [categorias, setcategorias] = useState(null);
    const [ultimoOrden, setUltimoOrden] = useState(0);
    const [CrearNuevaCategoriaMutation] = useMutation(NUEVA_CATEGORIA, {
        update(cache, { data: { crearNuevaCategoria } }) {
            const { obtenerCategorias } = cache.readQuery({ query: OBTENER_CATEGORIAS });
            cache.writeQuery({
              query: OBTENER_CATEGORIAS,
              data: {
                obtenerCategorias: [...obtenerCategorias, crearNuevaCategoria]
              }
            })
            setcategorias([...categorias,crearNuevaCategoria])
        }
    })
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
    
    const actualizaTodasLasCategorias = () => {
        setUltimoOrden(obtenerCategorias.length +1 );
        setcategorias(obtenerCategorias);
    }
   
    if(!categorias || obtenerCategorias.length !== categorias.length){
        actualizaTodasLasCategorias();
    }
   
    const agregarCategoria = () => {
        Swal.fire({
            title: 'Registrar nueva categoria',
            html: `<span style="margin: 1em; display: block; color: #dc2626; font-size: 2em"><ion-icon name="restaurant-outline"></ion-icon></span><input type="text" id="name" class="p-2 w-full h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" placeholder="Nombre de la categoria">`,
            confirmButtonText: 'Agregar',
            confirmButtonColor: '#ef4444',
            focusConfirm: false,
            preConfirm: async () => {
              const name = Swal.getPopup().querySelector('#name').value
              if (!name ) {
                Swal.showValidationMessage(`Porfavor de rellenar la caja de texto`)
              }
              const {data} = await CrearNuevaCategoriaMutation({
                  variables:{
                      input:{
                          nombre: name,
                          orden: ultimoOrden
                      }
                  }
              })
              //return { login: login, password: password }
            }
          }).then((result) => {
              if(result.isConfirmed && result.value){
                Swal.fire(
                    'Creado',
                    'Se creó la categoria Correctamente',
                    'success'
                );
              }
            
          })
    }

    const reordenar = (lista, startIndex, endIndex) => {
        const resultado =[...lista];
        const [eliminado] = resultado.splice(startIndex,1);
        resultado.splice(endIndex,0,eliminado);
        return resultado;
    }



    return (
        <DragDropContext onDragEnd={(result) => {
            
            const {source,destination} = result;
            if(!destination){
                return
            }
            if(source.index === destination.index && source.droppableId === destination.droppableId){
                return
            }
            setcategorias((prevCategorias
                ) => reordenar(prevCategorias,source.index, destination.index)
            );
        }}>
            <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
                <div className="h-16 flex justify-left items-center">
                    <h1 className="ml-4 text-2xl font-bold text-red-500">Lista de categorias</h1>
                </div>
                <div className="flex-grow m-8 h-16 overflow-y-auto rounded-xl">
                    <Droppable droppableId="categorias">
                    {(droppableProvided,snapshot) => (
                        <ul
                        className="mt-5"
                        {...droppableProvided.droppableProps}
                        ref= {droppableProvided.innerRef}>
                            {categorias.map((categoria,index) => (
                                <Draggable key={categoria.id} draggableId={categoria.id} index = {index}>
                                    {(draggableProvided) => (
                                        <li
                                            className=""
                                            {...draggableProvided.draggableProps}
                                            ref = {draggableProvided.innerRef}
                                            {...draggableProvided.dragHandleProps}
                                        >
                                            <Categoria
                                                categoria = {categoria}
                                                index = {index}
                                            />
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </ul>
                    )}
                    </Droppable>
                    <button onClick={() => agregarCategoria()} className="bg-red-500 text-white w-16 h-16 rounded-xl transition-all shadow-xl absolute hover:bg-red-600" style={{bottom: '3em', right: '3em'}}>
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