import React from 'react'
import {gql,useMutation} from '@apollo/client';
import Swal from "sweetalert2";
import {useRouter} from "next/router";

const Categoria = ({ categoria, index }) => {
    const {nombre,id} = categoria;
    const router = useRouter();
    const editaUsuario = () => {
        console.log("voy a editar");
    }
    return (
        <div className="flex">
            <div className="text-white bg-red-500 py-2 px-5">
                {index+1}
            </div>
            <div className="flex flex-wrap content-between">
                <div>
                    {categoria.nombre}
                </div>
                <div>
                    cosas
                </div>
            </div>
        </div>
    )
}

export default Categoria;
