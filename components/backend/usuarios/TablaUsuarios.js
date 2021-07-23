import React from 'react'
import { useQuery, gql  } from "@apollo/client";
import Usuario from './Usuario';

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
const TablaUsuarios = () => {
    const {data,loading,error} = useQuery(OBTENER_USUARIOS);

    if(loading){
        return "Cargando"
    }
    const {obtenerUsuarios} = data;

    return (
        <table>
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
                    <Usuario key={usuario.id} usuario={usuario}/>    
                ))}
            </tbody>
        </table>

    )
}

export default TablaUsuarios