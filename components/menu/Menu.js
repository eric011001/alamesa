import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import client from '../../config/apollo';
const OBTENER_MI_USUARIO = gql`
  query Query {
    obtenerMiUsuario {
      nombre
      apellidos
      email
      id
      rol
      status
    }
  }
`;
const Menu = () => {
  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const {data,loading,error} = useQuery(OBTENER_MI_USUARIO);
  
  if(!loading){
    const {obtenerMiUsuario} = data;
    if(!obtenerMiUsuario.nombre || obtenerMiUsuario.status === "INACTIVO"){
      if(!obtenerMiUsuario.nombre){
        console.log("se culmplio el primero");
      }
      if(obtenerMiUsuario.status === "INACTIVO"){
        console.log("se cumlio el segundo");
      }
      router.push("/controlPanel");
      client.resetStore();
    }
  }

  const toggle = () => {
    const estado = expandido;

    setExpandido(!estado);
  }
  
  return (
    <div className="menu shadow-lg" style={{width: expandido ? '18em' : '4.5em'}}>
      <button className="toggle-button" onClick={() => toggle()}>
        <ion-icon name={!expandido ? 'menu-outline' : 'close-outline'}></ion-icon>
      </button>
      <ul>
        <MenuItem titulo="Inicio" icono="home-outline" link="home"/>
        <MenuItem titulo="Pedidos" icono="copy-outline" link="pedidos"/>
        <MenuItem titulo="Platillos" icono="fast-food-outline" link="platillos"/>
        <MenuItem titulo="Mesas" icono="restaurant-outline" link="mesas"/>
        <MenuItem titulo="Usuarios" icono="person-outline" link="usuarios"/>
      </ul>
    </div>
  );
};

export default Menu