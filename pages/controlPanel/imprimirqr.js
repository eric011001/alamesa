import React from 'react'
import Head from 'next/head';
import Script from 'next/script'
import TablaQrMesas from '../../components/backend/mesas/TablaQrMesas';


const imprimirqr = () => {

  
  
  return(
    <>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="/styles/style.css"/>
      
    </Head>
      <Script src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></Script>
      <TablaQrMesas/>
    </>
  )
}

export default imprimirqr;