import React from 'react'
import {gql,useMutation} from '@apollo/client';
import Swal from "sweetalert2";
import {useRouter} from "next/router";

const Categoria = ({ categoria }) => {
    const {nombre,id} = categoria;
    const router = useRouter();
    const editaUsuario = () => {
        console.log("voy a editar");
    }
    return (
        <tr className="hover:bg-white cursor-default transition-all">
          <td className="px-4 py-2 text-center cursor-default">{nombre}</td>
          <td className="px-4 py-2 text-center cursor-default">cosas</td>
        </tr>
    )
}

export default Categoria;
