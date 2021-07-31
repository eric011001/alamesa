import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useQuery,gql,useMutation } from '@apollo/client'
import { Formik } from 'formik'
import Swal from 'sweetalert2'
import * as Yup from 'yup'
import Select from 'react-select'
import HeadApp from '../../../components/Head'
import Menu from '../../../components/menu/Menu'

const OBTENER_PLATILLO = gql`
    query Query($id: ID!) {
  obtenerPlatillo(id: $id) {
    categoria {
      id
      nombre
      orden
    }
    descripcion
    disponible
    extras {
      nombre
      precio
    }
    id
    nombre
    precio
    
  }
}
`;

const OBTENER_CATEGORIAS = gql`
  query Query {
    obtenerCategorias {
      id
      nombre
      orden
    }
  }
`;

const ACTUALIZA_PLATILLO = gql`
    mutation ActualizarPlatilloMutation($id: ID!, $input: PlatilloInput) {
        actualizarPlatillo(id: $id, input: $input) {
            descripcion
            disponible
            id
            nombre
        }
    }
`;

const disponibleOptions = [
    { value: "si", label: 'Sí' },
    { value: "no", label: 'No' }
];

const editarPlatillo = () => {
    const router = useRouter();
    const {query: {pid: id}} = router;
    const [disponible, setDisponible] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [mensaje, guardarMensaje] = useState(null);
    const [extras, setExtras] = useState([]);
    const inputNombreExtra = useRef(null);
    const inputPrecioExtra = useRef(null);

    const {data,loading,error} = useQuery(OBTENER_PLATILLO,{
        variables:{
            id
        }
    })

    const [ActualizarPlatilloMutation] = useMutation(ACTUALIZA_PLATILLO);

    const {data:dataCategoria, loading:loadingCategoria,error:errorCategoria} = useQuery(OBTENER_CATEGORIAS);

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

    const schemaValidation = Yup.object({
        nombreInput: Yup.string().required('El nombre es necesario'),
        precioInput: Yup.number().required('El precio es necesario').min(0),
        disponibleInput: Yup.string().required('La disponibilidad es necesaria'),
        categoriaInput: Yup.string().required('La categoria es necesaria'),
        descripcionInput: Yup.string()
    })

    if(loading || !data || loadingCategoria){
        return(<p>s</p>)
    }

    const actualizaElPlatillo = async valores => {
        const {nombreInput,precioInput,disponibleInput,categoriaInput,descripcionInput} = valores;
        let disponibles = true;
        if(disponibleInput === "no"){
            disponibles = false;
        }
        try {
            const {data} = ActualizarPlatilloMutation({
                variables:{
                    id,
                    input: {
                        nombre: nombreInput,
                        precio: precioInput,
                        disponible: disponibles,
                        categoria: categoriaInput,
                        descripcion: descripcionInput,
                        extras
                    }
                }
            })
            Swal.fire(
                'Actualizado',
                'Se actualizó el platillo exitosamente',
                'success'
              );
            router.push('/controlPanel/platillos')
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
            setTimeout(() => {
            guardarMensaje(null);
            }, 2500);
        }
    }

    const {obtenerPlatillo} = data;
    const platillo = {
        descripcionInput: obtenerPlatillo.descripcion,
        disponibleInput: obtenerPlatillo.disponible ? ("si") : ("no"),
        nombreInput: obtenerPlatillo.nombre,
        precioInput: obtenerPlatillo.precio,
        categoriaInput: obtenerPlatillo.categoria.id
    }
    console.log(platillo);

    if(!disponible){
        if(obtenerPlatillo.disponible){
            setDisponible({ value: "si", label: 'Sí' });
        }else{
            setDisponible({ value: "no", label: 'No' })
        }
        
        setExtras(obtenerPlatillo.extras.map(({__typename,...extra})=>extra))
    }  
    if(!categoria){
        setCategoria(obtenerPlatillo.categoria);
    }
    console.log(extras);
    const {obtenerCategorias} = dataCategoria;

    const agregarExtra = () => {
    
        if (inputNombreExtra.current.value && inputPrecioExtra.current.value) {
          const tempExtras = [...extras];
          tempExtras.push({
            nombre: inputNombreExtra.current.value,
            precio: parseInt(inputPrecioExtra.current.value)
          });
          setExtras(tempExtras);
          inputNombreExtra.current.value = '';
          inputPrecioExtra.current.value = 0 
        } else {
          console.log('Rellenele verga');
        }
      };
    
      const eliminarExtra = (index) => {
        const tempExtras = [...extras];
    
        tempExtras.splice(index, 1);
        setExtras(tempExtras);
      };


    return(
        <div className="flex">
            <HeadApp/>
            <Menu/>
            <div className="ml-6 mt-3 flex flex-col flex-grow h-auto mr-4 bg-white flex-shrink shadow-lg rounded-xl">
                <div className="h-16 flex justify-left items-center">
                    <h1 className="ml-4 text-2xl font-bold text-red-500">Agregar platillo</h1>
                </div>
                <div className="flex-grow m-8 flex flex-col">
          
                    <Formik
                        enableReinitialize
                        initialValues= {platillo}
                        validationSchema = {schemaValidation}
                        onSubmit={valores => actualizaElPlatillo(valores)}
                    >

                        {props => {
                            return(
                                <form onSubmit={props.handleSubmit}>
            <div className="flex flex-wrap">
              <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="nombreInput">Nombre:</label>
                <input type="text" id="nombreInput" name="nombreInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.nombreInput}/>
              </div>
              <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="precioInput">Precio:</label>
                <input type="number" id="precioInput" name="precioInput" className="p-2 m-2 w-auto h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-all" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.precioInput} />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="disponibleInput">Disponible:</label>
                <Select id="disponibleInput" options={disponibleOptions} className="m-2" styles={selectStyles}
                    onChange={selectedOption => {
                    props.handleChange('disponibleInput')(selectedOption.value); 
                    setDisponible(selectedOption);}} onBlur={props.handleBlur}
                    value={disponible}
                />
              </div>
              <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="categoriaInput">Categoría:</label>
                <Select
                  id="categoriaInput"
                  options={obtenerCategorias}
                  getOptionValue={(categoria) => categoria.id}
                  getOptionLabel={(categoria) => categoria.nombre}
                  className="m-2"
                  styles={selectStyles}
                  onChange={selectedOption => {
                    props.handleChange('categoriaInput')(selectedOption.id); 
                    setCategoria(selectedOption);}} onBlur={props.handleBlur}
                    value={categoria}
                  />
              </div>
              <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-4 mr-2 block" htmlFor="extrasInput">Extras:</label>
                <div className="flex flex-row">
                  <input type="text" ref={inputNombreExtra} className="p-2 m-2 w-2/6 sm:w-5/12 h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-colors" placeholder="Nombre"/>
                  <input type="number" ref={inputPrecioExtra} className="p-2 m-2 w-2/6 sm:w-5/12 h-10 block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-colors" placeholder="Precio"/>
                  <button type="button" className="bg-red-500 focus:bg-red-600 h-10 w-10 m-2 pt-1 text-2xl text-white rounded-lg outline-none transition-colors" onClick={() => agregarExtra()}>
                    <ion-icon name="add-circle-outline"></ion-icon>
                  </button>
                </div>
                <div className="">
                  {extras.map((extra, index) => { return(<span key={index} onClick={() => eliminarExtra(index)} className="bg-gray-200 px-1 m-1 rounded cursor-pointer"><small>{extra.nombre}</small></span>)})}
                  
                </div>
              </div>

            </div>
            <div className="flex flex-wrap">
              <div className="w-full flex-shrink-0 flex flex-col">
                <label className="font-semibold mt-2 mb-2 ml-3 mr-2 block" htmlFor="descripcionInput">Descripción:</label>
                <textarea className="p-2 m-2 w-auto block bg-gray-200 focus:bg-gray-300 outline-none rounded-xl transition-colors" id="descripcionInput"  onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.descripcionInput} ></textarea>
              </div>
            </div>
            <div className="flex flex-wrap justify-center">
              <button type="submit" className="m-2 block h-10 w-1/3 sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 h-10 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all">Actualizar platillo</button>
            </div>
          </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default editarPlatillo;