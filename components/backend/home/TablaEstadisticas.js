import React from 'react'
import GraficaSemanal from './Graficas/GraficaSemanal';

const TablaEstadisticas = () => {
    return(
        <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
            <div className="h-16 flex justify-left items-center">
                <h1 className="ml-4 text-2xl font-bold text-red-500">Resumen</h1>
            </div>
            <div className= " shadow-lg xl:w-1/3 md:w-full m-8 h-16 h-full">
                <h3 className="ml-4 text-2xl font-bold ">Pedidos diarios</h3>
                <GraficaSemanal/>
            </div>
        </div>
    )
}

export default TablaEstadisticas;