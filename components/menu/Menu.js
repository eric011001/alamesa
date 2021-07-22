import React, { useState } from 'react';
import MenuItem from './MenuItem';

const Menu = () => {
  const [expandido, setExpandido] = useState(false);

  const toggle = () => {
    const estado = expandido;

    setExpandido(!estado);
  }
  
  return (
    <div className="menu" style={{width: expandido ? '18em' : '4.5em'}}>
      <button className="toggle-button" onClick={() => toggle()}>
        <ion-icon name={!expandido ? 'menu-outline' : 'close-outline'}></ion-icon>
      </button>
      <ul>
        <MenuItem titulo="Inicio" icono="home-outline" link="home"/>
        <MenuItem titulo="Pedidos" icono="copy-outline" link="homse"/>
        <MenuItem titulo="Platillos" icono="fast-food-outline" link="hosame"/>
        <MenuItem titulo="Mesas" icono="restaurant-outline" link="homsae"/>
        <MenuItem titulo="Usuarios" icono="person-outline" link="usuarios"/>
      </ul>
    </div>
  );
};

export default Menu