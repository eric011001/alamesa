import React from 'react'
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';
import TablaPedidos from '../../components/backend/pedidos/TablaPedidos';
const pedidos = () => {
  return(
    <div className="flex">
        <HeadApp/>
        <Menu/>
        <TablaPedidos/>
    </div>
  )
}

export default pedidos;