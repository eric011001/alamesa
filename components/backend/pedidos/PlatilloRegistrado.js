import React, {useState} from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

const PlatilloRegistrado = ({platillo,pedido,setPedido}) => {
  const {id} = platillo;
  const [extras, setExtras] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [totalFinal, setTotalFinal] = useState(platillo.precio);
  console.log(platillo);
  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#d1d5db' : '#e5e7eb',
      color: '#212529',
    }),
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.75em',
      backgroundColor: state.isFocused ? '#d1d5db' : '#e5e7eb',
      borderWidth: '0px'
    }),
    menuList: (provided, state) => ({
      ...provided,
      borderRadius: '0.75em'
    })
  };



  const eliminaPlatillo = () => {
    setPedido((lastPedido) => lastPedido.filter(platilloActual => platilloActual.id !== id));
  }

  const cambioExtas = (opcion, index) => {
    setPedido((lastPedido) => {
      const miPedido = lastPedido.filter(platilloActual => platilloActual.id === id)[0];
      
      let extrasString =[];
      let totalPlatillo = platillo.precio;
      opcion.forEach(extraUnico => {
        extrasString.push(extraUnico.nombre);
        totalPlatillo += extraUnico.precio;
      });
      setTotalFinal(totalPlatillo*cantidad);
      miPedido.platilloTotal = totalPlatillo;
      miPedido.pedidoExtras = extrasString;
      return lastPedido;
    });
  }

  const cambioCantidad = (cantidadNueva) => {
    if(isNaN(cantidadNueva)){
      setCantidad(1)
    }else{
      if(cantidadNueva > 20){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La cantidad maxima de platillos es de 20',
          confirmButtonColor: '#ef4444'
        });
        setCantidad(20)
        return
      }else if(cantidadNueva <1){
        setCantidad(1)
      }
      setPedido((lastPedido) => {
        const miPedido = lastPedido.filter(platilloActual => platilloActual.id === id)[0];
        miPedido.cantidad = cantidadNueva;
        return lastPedido;
      });
      setTotalFinal(lastTotal => (lastTotal/cantidad)*cantidadNueva);
      setCantidad(cantidadNueva);
      
    }
  }

  
  return (
    <div key={platillo.id} className="flex flex-row items-center mx-2 border-b transition-colors justify-between flex-wrap">
      <div className="flex w-full p-2 justify-between">
        <div className="flex-shrink-0  sm:w-full ">{platillo.nombre} - ${platillo.precio}</div>
        <button onClick={() => eliminaPlatillo()} className="flex  mr-10"><ion-icon name="close-circle-outline" style={{ fontSize: "2em" }}></ion-icon></button>
      </div>
      <div className="flex-shrink-0 p-2 w-full sm:w-full ">
        <input placeholder="Cantidad" value={cantidad} onChange={(e) => cambioCantidad(parseInt(e.target.value))} type="number" min="1" max="10" className="w-full h-8 bg-gray-100 focus:bg-gray-200 outline-none rounded-lg p-2" />
      </div>
      
      <div className="flex-shrink-0 p-2 w-full sm:w-full w-6/12">
        <Select 
          placeholder= {`extras del platillo`}
          options={platillo.extras}
          getOptionValue={(extra) => extra.nombre}
          getOptionLabel={(extra) => `${extra.nombre}${extra.precio !== 0 ? (`- $${extra.precio}`) : ("")}`}
          isMulti={true}
          styles={selectStyles}
          onChange= {(selectedOption) => cambioExtas(selectedOption)}
          className="w-full"
        />
      </div>
      <div className="w-full m-5">
        <div className= "flex justify-end">
          <p className="text-lg font-semibold">Total $<span>{totalFinal}</span></p>
        </div>
      </div>
      
      
      
    </div>
  )

}

export default PlatilloRegistrado;