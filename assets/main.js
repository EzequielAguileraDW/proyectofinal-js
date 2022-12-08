const service = document.getElementById('service');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {}; 
const pagar = document.querySelector('.pagar');



document.addEventListener('DOMContentLoaded', () => {
    fetchServicios();
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        mostrarCarrito();
    }
})

service.addEventListener('click', e => {
    addCarrito(e);
})

items.addEventListener('click', e => {
    btnAccion(e);
})




//Traigo los servicios alojados en servicios.json
const fetchServicios = async () => {
    try {
        const response = await fetch("./servicios.json");
        const datos = await response.json();
        //console.log(datos);
        mostrarServicios(datos);
    } catch (error){
        console.log(error);
    }
}


//Mostrar los servicios modificando el DOM
const mostrarServicios = datos => {
    datos.forEach(servicios => {
        templateCard.querySelector('h5').textContent = servicios.nombre;
        templateCard.querySelector('p').textContent = servicios.precio;
        templateCard.querySelector('img').setAttribute("src", servicios.img);
        templateCard.querySelector('.btn').dataset.id = servicios.id;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    service.appendChild(fragment);
}



//Agregar al carrito
const addCarrito = e => {
    if(e.target.classList.contains('btn')){
        setCarrito(e.target.parentElement);
    }
    Toastify({
        text: "Servicio agregado :)",
        duration: 3000,
        gravity: 'bottom',
        style: {
            background: "blue",
        }
    }).showToast();
    e.stopPropagation();
}


//Setear el carrito
const setCarrito = objeto => {
    const servicio = {
        id: objeto.querySelector('.btn').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(servicio.id)){
        servicio.cantidad = carrito[servicio.id].cantidad + 1;  
    }

    carrito[servicio.id] = {...servicio};
    mostrarCarrito();
}




//Mostrar el carrito modificando el DOM
const mostrarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(servicio => {
        templateCarrito.querySelector('th').textContent = servicio.id;
        templateCarrito.querySelectorAll('td')[0].textContent = servicio.nombre;
        templateCarrito.querySelectorAll('td')[1].textContent = servicio.cantidad;
        templateCarrito.querySelector('.btn-mas').dataset.id = servicio.id;
        templateCarrito.querySelector('.btn-menos').dataset.id = servicio.id;
        templateCarrito.querySelector('span').textContent = servicio.cantidad * servicio.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    mostrarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
}



//Mostrar la información según servicios seleccionados
const mostrarFooter = () => {
    footer.innerHTML = '';
    
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Sin servicios seleccionados :(</th>
        `;
        return;
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0 );
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0 );

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        carrito = {};
        mostrarCarrito();
    })

    const pagar = document.getElementById('pagar');
    pagar.addEventListener('click', () => {
        (async () => {
            const { value: pago } = await Swal.fire({
                title: 'Seleccioná un método de pago',
                color: '#01000f',
                input: 'select',
                inputOptions: {
                    MercadoPago: 'Mercado Pago',
                    Efectivo: 'Efectivo',
                    Paypal: 'PayPal'
                },
                inputPlaceholder: 'Seleccioná',
                showCancelButton: true,
                confirmButtonColor: '#1987b3',
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value === 'MercadoPago') {
                            resolve();
                        } else if (value === 'Efectivo'){
                            resolve();
                        } else if (value === 'Paypal'){
                            resolve();
                        } else {
                            resolve('Necesitas seleccionar un método :)');
                        }
                    })
                }
            })
    
            if (pago === 'MercadoPago') {
                Swal.fire({
                    title:`Seleccionaste: ${pago}`,
                    text:'CVU: xxxxxxxxx',
                    confirmButtonColor: '#1987b3'
                });
            } else if (pago === 'Efectivo') {
                Swal.fire({
                    title:`Seleccionaste: ${pago}`,
                    confirmButtonColor: '#1987b3'
                });
            } else if (pago === 'Paypal'){
                Swal.fire({
                    title:`Seleccionaste: ${pago}`,
                    text: 'Solicitar boleta por mail: ezequiel@gmail.com',
                    confirmButtonColor: '#1987b3'
                });
            }
        })()
    })

    btnVaciar.addEventListener("click", () => {
        Toastify({
            text: "Carrito vaciado :(",
            duration: 3000,
            gravity: 'bottom',
            style: {
                background: "red",
            }
        }).showToast();
    })
}



//Botones para aumentar o disminuir cantidad
const btnAccion = e => {
    //Aumentar cantidad en carrito
    if(e.target.classList.contains('btn-mas')) {
        const servicio = carrito[e.target.dataset.id];
        servicio.cantidad++;  
        carrito[e.target.dataset.id] = {...servicio};
        Toastify({
            text: "Servicio agregado :)",
            duration: 3000,
            gravity: 'bottom',
            style: {
                background: "blue",
            }
        }).showToast();
        mostrarCarrito();
    }

    if(e.target.classList.contains('btn-menos')) {
        const servicio = carrito[e.target.dataset.id];
        servicio.cantidad--;  
        if(servicio.cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
        Toastify({
                text: "Servicio quitado :(",
                duration: 3000,
                gravity: 'bottom',
                style: {
                    background: "red",
                }
            }).showToast();
        mostrarCarrito();
    }

    e.stopPropagation();
}








