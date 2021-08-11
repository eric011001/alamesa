import React from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const ELIMINAR_CATEGORIA = gql`
  mutation EliminarCategoriaMutation($id: ID!) {
    eliminarCategoria(id: $id)
  }
`;

const ACTUALIZAR_CATEGORIA = gql`
  mutation ActualizarCategoriaMutation($id: ID!, $input: CategoriaInput) {
    actualizarCategoria(id: $id, input: $input) {
      id
      nombre
      orden
      __typename
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

const Categoria = ({ categoria, index }) => {
  const { nombre, id } = categoria;
  const router = useRouter();

  const [EliminarCategoriaMutation] = useMutation(ELIMINAR_CATEGORIA,{
    update(cache) {
      const { obtenerCategorias } = cache.readQuery({ query: OBTENER_CATEGORIAS });
      cache.writeQuery({
        query: OBTENER_CATEGORIAS,
        data: {
          obtenerCategorias: obtenerCategorias.filter((categoriaActual) => categoriaActual.id !== id)
        }
      });
    }
  });
  const [ActualizarCategoriaMutation] = useMutation(ACTUALIZAR_CATEGORIA);

  const editarCategoria = () => {
    Swal.fire({
      title: "Actualizar categoría",
      html: `<span style="margin: 1em; display: block; color: #dc2626; font-size: 2em"><ion-icon name="restaurant-outline"></ion-icon></span><input type="text" id="name" value="${nombre}" class="p-2 w-full h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" placeholder="Nombre de la categoria">`,
      confirmButtonText: "Agregar",
      confirmButtonColor: "#ef4444",
      focusConfirm: false,
      preConfirm: async () => {
        const name = Swal.getPopup().querySelector("#name").value;
        if (!name) {
          Swal.showValidationMessage(`Porfavor de rellenar la caja de texto`);
        }
        try {
          const {data} = ActualizarCategoriaMutation({
            variables:{
              id,
              input: {
                nombre: name
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Se actualiz+o la categoria correctamente',
          confirmButtonColor: '#ef4444'
        });
        router.reload("/controlPanel/categorias")
      }
    });
  };

  const eliminarCategoria = () => {
    Swal.fire({
      title: '¿Deseas eliminar a esta Categoria?',
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
          const { data } = await EliminarCategoriaMutation({
            variables: {
              id
            }
          });
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: data.EliminarCategoriaMutation,
            confirmButtonColor: '#ef4444'
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
  return (
    <div className="flex rounded-l-xl p-1">
      <div className="text-white bg-red-500 h-12 w-12 flex items-center justify-center rounded-l-xl font-semibold">{index + 1}</div>
      <div className="flex justify-center items-center bg-gray-100 hover:bg-white w-full rounded-r-xl transition-colors">
        <div className="ml-10">{categoria.nombre}</div>
        &nbsp;
        <div className="flex ml-auto mr-10">
          <button className="bg-red-500 text-white w-8 h-8 rounded-lg mx-2 text-xl p-1" onClick= {() => editarCategoria()}>
            <ion-icon name="pencil"></ion-icon>
          </button>
          <button className="bg-red-500 text-white w-8 h-8 rounded-lg mx-2 text-xl p-1" onClick= {() => eliminarCategoria()}>
            <ion-icon name="trash"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categoria;
