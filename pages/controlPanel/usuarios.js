import React from 'react';
import TablaUsuarios from '../../components/backend/usuarios/TablaUsuarios';
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';

const usuarios = () => {
  return(
    <>
      <HeadApp/>
      <Menu/>
      <div className="borde ml-24 ">
        <TablaUsuarios/>
      </div>
    </>
  )
}

export default usuarios;