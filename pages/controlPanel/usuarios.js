import React from 'react';
import TablaUsuarios from '../../components/backend/usuarios/TablaUsuarios';
import HeadApp from '../../components/Head';
import Menu from '../../components/menu/Menu';

const usuarios = () => {
  return(
    <div className="flex">
      <HeadApp/>
      <Menu/>
      <TablaUsuarios/>
    </div>
  )
}

export default usuarios;