const divservicios = document.getElementById('divservicios');
const carritoServicios = document.getElementById('carrito-servicios');
let carrito = {};


document.addEventListener('DOMContentLoaded', () => {
    fetchServicios();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        //mostrarCarrito();
    }
})

divservicios.addEventListener('click', e => {
    addCarrito(e);
})

const fetchServicios = async () => {
    try {
        const response = await fetch("./servicios.json");
        const datos = await response.json();
        console.log(datos);
        mostrarServicios(datos);
    } catch (error) {
        console.log(error);
    }
}

const mostrarServicios = datos => {
    datos.forEach(servicios => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML += `
                <div id="${servicios.id}">
                    <img class="servicio-img" src="${servicios.img}" alt="${servicios.nombre}" style=" width: 150px; height: 150px;">
                    <div class="servicio-detalle">
                        <h2 class="servicio-nombre">${servicios.nombre}</h2>
                        <b class="servicio-precio">$${servicios.precio}</b>
                        <button class="servicio-agregar" id="agregar${servicios.id}">Agregar</button>
                    </div>
                </div>
                `;
        divservicios.append(div);
    });
}


const addCarrito = e => {
    if (e.target.classList.contains('servicio-agregar')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}


const setCarrito = objeto => {
    const servicio = {
        id: objeto.querySelector('.servicio-agregar').dataset.id,
        nombre: objeto.querySelector('h2').textContent,
        precio: objeto.querySelector('b').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(servicio.id)) {
        servicio.cantidad = carrito[servicio.id].cantidad + 1;
    }

    carrito[servicio.id] = { ...servicio };
    mostrarCarrito();
}


const mostrarCarrito = () => {
    carritoServicios.innerHTML = '';
    Object.values(carrito).forEach(item => {
        carritoServicios.innerHTML += `
                    <div class="fila-servicios">
                        <div class="carrito-item carrito-column">
                        <img class="img-carrito" src="${item.img}" width=50 height=50>
                        <span class="carrito-title">${item.nombre}</span>
                    </div>
                    <span class="carrito-precio cart-column">$${item.precio}</span>
                        <div class="carrito-cantidad cart-column">
                            <input class="carrito-cantidad-input" min="1" type="number" value="${item.quantity}">
                            <button class="btn-eliminar" type="button">Eliminar</button>
                        </div>
                    </div>
                `;
                carritoServicios.appendChild();
    })
    
}