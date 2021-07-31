import React from 'react'
import {gql,useQuery} from '@apollo/client';
import QRCode from 'qrcode.react'
const OBTENER_MESAS = gql`
    query Query {
        obtenerMesas {
            id
            nombre
        }
    }
`;

const imprimirqr = () => {
  const {data,loading,error} = useQuery(OBTENER_MESAS);
  if(loading){
    return(<p>Cargando...</p>)
  }

  const {obtenerMesas} = data;

  return(
    <div className="grid grid-flow-col grid-cols-3 grid-rows-3 gap-4">
      {obtenerMesas.map(mesa => (
        <QRCode value={mesa.id} />
      ))}
    </div>
  )
}

export default imprimirqr;