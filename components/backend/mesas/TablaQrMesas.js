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
        {
          
            
            <div className="grid grid-cols-3 gap-4">
            {
              obtenerMesas.map(mesa => (
                <div className='p-5 border-2 border-sky-500 rounded-lg'>
                  <QRCode key={mesa.id} value={`${mesa.nombre}`} size={200} />
                  <div className='text-center font-bold text-lg mt-2'>
                    <p>{mesa.nombre}</p>
                  </div>
                </div>
              ))
                    
                  
            }
            </div>
            
        }
    </div>
  )
}

export default TablaQrMesas;