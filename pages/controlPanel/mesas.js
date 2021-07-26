import React from 'react'
import Menu from '../../components/menu/Menu';
import TablaMesas from '../../components/backend/mesas/TablaMesas'
import HeadApp from '../../components/Head'

const mesas = () => {
    return(
        <div className= "flex">
            <HeadApp/>
            <Menu/>
            <TablaMesas/>
        </div>
    )
}

export default mesas;