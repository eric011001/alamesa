import React from 'react'
import TablaPlatillos from '../../components/backend/platillos/TablaPlatillos'
import HeadApp from '../../components/Head'
import Menu from '../../components/menu/Menu'

const platillos = () => {
    return(
        <div className= "flex">
            <HeadApp/>
            <Menu/>
            <TablaPlatillos/>
        </div>
    )
}

export default platillos;