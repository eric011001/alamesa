import React from 'react'
import { useQuery, gql,useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Mesa from "./Mesa";
import Swal from "sweetalert2";
const OBTENER_MESAS = gql`
    query Query {
        obtenerMesas {
            id
            nombre
        }
    }
`;

const NUEVA_MESA = gql`
    mutation CrearMesaMutation($input: MesaInput) {
        crearMesa(input: $input) {
            id
            nombre
            __typename
        }
    }
`;
const TablaMesas = () => {
    const router = useRouter();
    const {data,loading, error} = useQuery(OBTENER_MESAS);
    const [CrearMesaMutation] = useMutation(NUEVA_MESA,{
        update(cache, { data: { crearMesa } }) {
            const { obtenerMesas } = cache.readQuery({ query: OBTENER_MESAS });
            cache.writeQuery({
              query: OBTENER_MESAS,
              data: {
                obtenerMesas: [...obtenerMesas, crearMesa]
              }
            })
          }
    });

    if(loading){
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
    const agregarMesa = () => {
        Swal.fire({
            title: 'Registrar nueva mesa',
            html: `<input type="text" id="name" class="swal2-input" placeholder="Nombre de la mesa">`,
            confirmButtonText: 'Agregar',
            focusConfirm: false,
            preConfirm: async () => {
              const name = Swal.getPopup().querySelector('#name').value
              if (!name ) {
                Swal.showValidationMessage(`Porfavor de rellenar la caja de texto`)
              }
              const {data} = await CrearMesaMutation({
                  variables:{
                      input:{
                          nombre: name
                      }
                  }
              })
              //return { login: login, password: password }
            }
          }).then((result) => {
              if(result.isConfirmed && result.value){
                Swal.fire(
                    'Creado',
                    'Se creó la mesa Correctamente',
                    'success'
                );
              }
            
          })
    }
    return (
        <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
            <div className="h-16 flex justify-left items-center">
                <h1 className="ml-4 text-2xl font-bold text-red-500">Lista de mesas</h1>
            </div>
            <div className="flex-grow m-8 h-16 overflow-y-auto rounded-xl">
                <table className="table-auto w-full overflow-y-auto">
                <thead>
                    <tr className="bg-red-500">
                    <th className="text-white px-4 py-2">Nombre</th>
                    <th className="text-white px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-100">
                    {obtenerMesas.map(mesa => (
                        <Mesa key={mesa.id} mesa={mesa} />
                    ))}
                </tbody>
                </table>
                <button onClick={() => agregarMesa()} className="bg-red-500 text-white w-16 h-16 rounded-xl transition-all shadow-xl absolute hover:bg-red-600" style={{bottom: '3em', right: '3em'}}>
                <ion-icon name="add-circle-outline" style={{fontSize: '1.5em'}}></ion-icon>
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
    )
}

export default TablaMesas;