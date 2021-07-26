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

    const eliminaElUsuario = () => {
        Swal.fire({
          title: '¿Deseas elimiar a este Usuario?',
          text: 'Esta acción no se peude deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
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
          <td className="px-4 py-2 text-center cursor-default">cosas</td>
        </tr>
      )
}


export default Mesa;