import React from 'react'
import TablaCategorias from '../../components/backend/categorias/TablaCategoria'
import HeadApp from '../../components/Head'
import Menu from '../../components/menu/Menu'

const categorias = () => {
    return(
        <div className="flex">
            <HeadApp/>
            <Menu/>
            <TablaCategorias/>
        </div>
    )
}

export default categorias;