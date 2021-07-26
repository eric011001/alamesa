import React from 'react'
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const ELIMINA_PLATILLO = gql`
  mutation EliminarPlatilloMutation($id: ID!) {
    eliminarPlatillo(id: $id)
  }
`;

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

const Platillo = ({platillo}) => {
    const {nombre, precio, disponible,id, categoria: {nombre:nombreCategoria}} = platillo;
    const router = useRouter();

    const [EliminarMesaMutation] = useMutation(ELIMINA_PLATILLO,{
      update(cache) {
        const { obtenerPlatillos } = cache.readQuery({ query: OBTENER_PLATILLOS });
        cache.writeQuery({
          query: OBTENER_PLATILLOS,
          data: {
            obtenerPlatillos: obtenerPlatillos.filter((platilloActual) => platilloActual.id !== id)
          }
        });
      }
    })

    const editaPlatillo = () => {
        console.log("voy a editar un platillo");
    }

    const eliminaElPlatillo = () => {
      Swal.fire({
        title: '¿Deseas elimiar a este platillo?',
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
          <td className="px-4 py-2 text-center cursor-default">{precio}</td>
          <td className="px-4 py-2 text-center cursor-default">{disponible ? ("sí") : ("no")}</td>
          <td className="px-4 py-2 text-center cursor-default">{nombreCategoria}</td>
          <td className="px-4 py-2 text-center cursor-default">
            <button onClick={() => editaPlatillo()}>editar</button>
            <button onClick={() => eliminaElPlatillo()}>Elminar</button>
          </td>
        </tr>
      )
}

export default Platillo;