import HeadApp from '../components/Head';
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div style={{width: '100%', height: '100%', display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
     
        <img src='/logo.png' style={{width: '30%'}} className='h-32'/>
      
    </div>
  )
}
