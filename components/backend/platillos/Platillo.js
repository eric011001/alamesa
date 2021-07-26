import React from 'react'
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Platillo = ({platillo}) => {
    const {nombre, precio, disponible, categoria: {nombre:nombreCategoria}} = platillo;
    const router = useRouter();
    const editaPlatillo = () => {
        console.log("voy a editar un platillo");
    }

    return (
        <tr className="hover:bg-white cursor-default transition-all">
          <td className="px-4 py-2 text-center cursor-default">{nombre}</td>
          <td className="px-4 py-2 text-center cursor-default">{precio}</td>
          <td className="px-4 py-2 text-center cursor-default">{disponible ? ("sí") : ("no")}</td>
          <td className="px-4 py-2 text-center cursor-default">{nombreCategoria}</td>
          <td className="px-4 py-2 text-center cursor-default">cosas</td>
        </tr>
      )
}

export default Platillo;