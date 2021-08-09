import React from 'react';
import {gql,useQuery} from "@apollo/client";
import QRCode from 'qrcode.react';
import { useRouter } from 'next/router';
const OBTENER_MESAS = gql`
    query Query {
        obtenerMesas {
            id
            nombre
        }
    }
`;

const TablaQrMesas = () => {
  const router = useRouter();
  let hostname = '';
  if (typeof window !== 'undefined') {
    hostname = window.location.origin;
    setTimeout(() => {
      window.print();
      router.push('/controlPanel/mesas')
    }, 300);
  }
  const {data,loading,error} = useQuery(OBTENER_MESAS);
  if(loading){
    return(<p>Cargando...</p>)
  }

  const {obtenerMesas} = data;
  const secciones = Math.round(obtenerMesas.length/8);
  const imprimeSecciones = () => {
    let html = '';

    for (let i = 0; i < secciones; i++) {
      /*html += <div className="grid grid-cols-2 gap-4 ">;
      for (let j = 0; j < 8; j++) {
        
        
      }
      html += </div>;*/
    }
    return html;
  }
  console.log(secciones);
  return(
    <div className="w-full">
        {obtenerMesas.map((mesa,index) => (
          index + 1 % 8 === 0 ? (
            <>
            <QRCode key={mesa.id} size={200} value={`${hostname}/nuevoPedido/${mesa.id}`} />
            <div className="saltopagina" style={{backgroundColor: 'red'}}>&nbsp;</div>
            </>
          ) : (
            <QRCode key={mesa.id} size={200} value={`${hostname}/nuevoPedido/${mesa.id}`} />
          )    
        ))}
    </div>
  )
}

export default TablaQrMesas;