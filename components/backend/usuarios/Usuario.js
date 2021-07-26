import React from 'react'
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const ELIMINA_USUARIO = gql`
    mutation EliminarUsuarioMutation($id: ID!) {
        eliminarUsuario(id: $id)
    }
`;

const OBTENER_USUARIOS = gql`
    query Query {
        obtenerUsuarios {
            nombre
            apellidos
            email
            id
            rol
            status
        }
    }
`;

const Usuario = ({ usuario }) => {

  const { nombre, apellido, email, rol, id, status } = usuario;
  const router = useRouter();
  const [EliminarUsuarioMutation] = useMutation(ELIMINA_USUARIO, {
    update(cache) {
      const { obtenerUsuarios } = cache.readQuery({ query: OBTENER_USUARIOS });
      cache.writeQuery({
        query: OBTENER_USUARIOS,
        data: {
          obtenerUsuarios: obtenerUsuarios.filter((usuarioActual) => usuarioActual.id !== id)
        }
      });
    }
  });

  const editaUsuario = () => {
    console.log("me voy a editar");
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
          const { data } = await EliminarUsuarioMutation({
            variables: {
              id
            }
          });
          Swal.fire('Eliminado', data.EliminarUsuarioMutation, 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  }


  /* En los botones el de borrar ponle el onClick a la funcion eliminaElUsuario y al de editar editaUsuario */
  return (
    <tr className="hover:bg-white cursor-default transition-all">
      <td className="px-4 py-2 text-center cursor-default">{nombre} {apellido}</td>
      <td className="px-4 py-2 text-center cursor-default">{email}</td>
      <td className="px-4 py-2 text-center cursor-default">{rol}</td>
      <td className="px-4 py-2 text-center cursor-default">{status}</td>
      <td className="px-4 py-2 text-center cursor-default">
        <button onClick={() => editaUsuario()}>editar</button>
        <button onClick={() => eliminaElUsuario()}>Elminar</button>
      </td>
    </tr>
  )
}

export default Usuario;