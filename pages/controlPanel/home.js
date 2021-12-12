import React from 'react';
import Menu from '../../components/menu/Menu';
import HeadApp from '../../components/Head';
import TablaEstadisticas from '../../components/backend/home/TablaEstadisticas';

const Home = () => {
  return (
    <div className="flex">
    <HeadApp/>
    <Menu/>
    <TablaEstadisticas/>
    </div>
  )
}

export default Home;