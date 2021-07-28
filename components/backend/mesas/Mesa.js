import React from 'react'
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {useRouter} from "next/router";

const ELIMINA_MESA = gql`
    mutation EliminarMesaMutation($id: ID!) {
        eliminarMesa(id: $id)
    }
`;

const OBTENER_MESAS = gql`
    query Query {
        obtenerMesas {
            id
            nombre
        }
    }
`;

const Mesa = ({mesa}) => {
    const {nombre, id} = mesa;
    const router = useRouter();
    const [EliminarMesaMutation] = useMutation(ELIMINA_MESA,{
        update(cache) {
            const { obtenerMesas } = cache.readQuery({ query: OBTENER_MESAS });
            cache.writeQuery({
              query: OBTENER_MESAS,
              data: {
                obtenerMesas: obtenerMesas.filter((mesaActual) => mesaActual.id !== id)
              }
            });
          }
    });

    const editaMesa = () => {
        console.log("voy a editar la mesa");
    }

    const eliminaLaMesa = () => {
        Swal.fire({
          title: '¿Deseas eliminar a esta Mesa?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          iconColor: '#ef4444',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#6b7280',
          reverseButtons: true,
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
          if (result.value) {
            try {
              const { data } = await EliminarMesaMutation({
                variables: {
                  id
                }
              });
              Swal.fire('Eliminado', data.EliminarMesaMutation, 'success');
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
      return (
        <tr className="hover:bg-white cursor-default transition-all">
          <td className="px-4 py-2 text-center cursor-default">{nombre}</td>
          <td className="px-4 py-2 text-center cursor-default">
            <button onClick={() => editaMesa()} className="bg-red-500 text-white w-8 h-8 rounded-lg mx-2 text-xl p-1 outline-none">
              <ion-icon name="pencil"></ion-icon>
            </button>
            <button onClick={() => eliminaLaMesa()} className="bg-red-500 text-white w-8 h-8 rounded-lg mx-2 text-xl p-1 outline-none">
              <ion-icon name="trash"></ion-icon>
            </button>
          </td>
        </tr>
      )
}


export default Mesa;