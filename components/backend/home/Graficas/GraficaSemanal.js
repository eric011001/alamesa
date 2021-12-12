import React, {useState} from 'react'
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
import { gql, useQuery } from "@apollo/client";

const OBTENER_DATOS =gql`
    query Query {
        obtenerIngresosyPedidos {
            fecha {
            day
            hour
            month
            year
            }
            ingresos
            noPedidos
        }
    }
`;
  const data2 = [
    {
      name: 'Page A',
      uv: 590,
      pv: 800,
      amt: 1400,
    },
    {
      name: 'Page B',
      uv: 868,
      pv: 967,
      amt: 1506,
    },
    {
      name: 'Page C',
      uv: 1397,
      pv: 1098,
      amt: 989,
    },
    {
      name: 'Page D',
      uv: 1480,
      pv: 1200,
      amt: 1228,
    },
    {
      name: 'Page E',
      uv: 1520,
      pv: 1108,
      amt: 1100,
    },
    {
      name: 'Page F',
      uv: 1400,
      pv: 680,
      amt: 1700,
    },
  ];

const GraficaSemanal = () => {
    const [info, setInfo] = useState([])
    const {data,loading,error} = useQuery(OBTENER_DATOS);

    if (loading) {
        return (
            <div className="ml-6 mt-3 flex flex-grow items-center justify-center">
                <svg
                className="animate-spin -ml-1 mr-3 h-10 w-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-100"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="red"
                        strokeWidth="3"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>
        );
    }
    const {obtenerIngresosyPedidos} = data;
    if(info.length != obtenerIngresosyPedidos.length){
      let tempData = [];
      obtenerIngresosyPedidos.forEach(dato => {
        let fecha = `${dato.fecha.year}-${dato.fecha.month < 10 ? ("0") : ""}${dato.fecha.month}-${dato.fecha.day < 10 ?("0") : ""}${dato.fecha.day}`
        tempData.push({fecha: fecha,ingresos: dato.ingresos, noPedidos:dato.noPedidos});
      })
      setInfo(tempData)
    }
    


    return(
         <ResponsiveContainer width="100%" height="60%">
        <ComposedChart
          width={500}
          height={400}
          data={info}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="fecha" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ingresos" barSize={20} fill="#EF4444" />
          <Line type="monotone" dataKey="noPedidos" stroke="#000" />
        </ComposedChart>
      </ResponsiveContainer>
    )
}

export default GraficaSemanal;