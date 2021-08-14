import React, {useState} from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

const PlatilloRegistrado = ({platillo}) => {
  const [extras, setExtras] = useState([]);
  const [cantidad, setCantidad] = useState(0);
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

  const cambioCantidad = (cantidad) => {
    if(isNaN(cantidad)){
      setCantidad(0)
    }else{
      if(cantidad > 20){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La cantidad maxima de platillos es de 20',
          confirmButtonColor: '#ef4444'
        });
        return
      }
      setCantidad(cantidad)
    }
  }

  
  return (
    <div key={platillo.id} className="flex flex-row items-center mx-2 border-b transition-colors justify-between flex-wrap">
      <div className="flex-shrink-0 p-2 w-full sm:w-full w-2/12">{platillo.nombre} - ${platillo.precio}</div>
      <div className="flex-shrink-0 p-2 w-full sm:w-full w-4/12">
        <input placeholder="Cantidad" onChange={(e) => cambioCantidad(parseInt(e.target.value))} type="number" min="1" max="10" className="w-full h-8 bg-gray-100 focus:bg-gray-200 outline-none rounded-lg p-2" />
      </div>
      {[...Array(cantidad)].map((x,i) => platillo.extras.length !== 0 ? (
        <div key={i} className="flex-shrink-0 p-2 w-full sm:w-full w-6/12">
          <Select 
            options={platillo.extras}
            getOptionValue={(extra) => extra.nombre}
            getOptionLabel={(extra) => `${extra.nombre}${extra.precio !== 0 ? (`- $${extra.precio}`) : ("")}`}
            isMulti={true}
            styles={selectStyles}
            className="w-full"
          />
        </div>
      ) : (null))}
      
    </div>
  )

}

export default PlatilloRegistrado;