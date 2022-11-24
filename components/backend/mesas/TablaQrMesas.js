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
    }, 300);
    setTimeout(() => {
      router.push('/controlPanel/mesas')
    }, 300);
  }
  const {data,loading,error} = useQuery(OBTENER_MESAS);
  if(loading){
    return(<p>Cargando...</p>)
  }

  const {obtenerMesas} = data;
  const secciones = Math.round(obtenerMesas.length/8);
  
  return(
    <div className="w-full">
        {/*
          [...Array(secciones)].map((_,index) => (
            <>
            <div className="grid grid-cols-2 gap-4">
            {
              [...Array(8)].map((_,index2) => {
                if(obtenerMesas[(8*index)+index2]){
                  return(
                    <QRCode key={obtenerMesas[(8*index)+index2].id} size={200} value={`${hostname}/nuevoPedido/${obtenerMesas[(8*index)+index2].id}`} />
                  )
                }
              })
            }
            </div>
            <div className="saltopagina" style={{backgroundColor: 'red'}}>&nbsp;</div>
            </>
          ))*/
          obtenerMesas.map(mesa => (
            <div className='p-5'>
              <QRCode key={mesa.nombre} size={200} value={`${mesa.nombre}`} />
            </div>
          ))
        }
    </div>
  )
}

export default TablaQrMesas;