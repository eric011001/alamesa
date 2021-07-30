import React from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Categoria = ({ categoria, index }) => {
  const { nombre, id } = categoria;
  const router = useRouter();
  const editarCategoria = () => {
    console.log("voy a editar");
  };
  return (
    <div className="flex rounded-l-xl p-1">
      <div className="text-white bg-red-500 h-12 w-12 flex items-center justify-center rounded-l-xl font-semibold">{index + 1}</div>
      <div className="flex justify-center items-center bg-gray-100 hover:bg-white w-full rounded-r-xl transition-colors">
        <div className="ml-10">{categoria.nombre}</div>
        &nbsp;
        <div className="flex ml-auto mr-10">
          <button className="bg-red-500 text-white w-8 h-8 rounded-lg mx-2 text-xl p-1">
            <ion-icon name="pencil"></ion-icon>
          </button>
          <button className="bg-red-500 text-white w-8 h-8 rounded-lg mx-2 text-xl p-1">
            <ion-icon name="trash"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categoria;
