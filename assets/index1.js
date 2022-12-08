//FETCH SERVICIOS
let divservicios = document.getElementById('divservicios');
let carrito = [];
let total = 0;


let cargarServicios = async () => {
    let response = await fetch("./servicios.json");
    let servicios = await response.json();
    let arrayServicios = servicios.slice(0, 4);

    arrayServicios.forEach(servicio => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML += `
                        <img class="servicio-img" src="${servicio.img}" alt="${servicio.nombre}">
                        <div class="servicio-detalle">
                            <h2 class="servicio-nombre">${servicio.nombre}</h2>
                            <b class="servicio-precio">$${servicio.precio}</b>
                            <button class="servicio-agregar" id="agregar${servicio.id}">Agregar</button>
                        </div>    
                    `;
        divservicios.append(div);
    });

    let btnsAdd = document.getElementsByClassName('servicio-agregar');
    btnsAdd = [...btnsAdd];

    let carritoServicios = document.querySelector('.carrito-servicios');
    

    btnsAdd.forEach(btn => {
        btn.addEventListener('click', e => {
            console.log('click');

            console.log(e.target.parentElement.id);

            carritoServicios.innerHTML += `
                <div class="fila-servicios">
                    <div class="carrito-item carrito-column">
                    <img src="${e.target.parentElement.parentElement.id}">
                    <span class="cart-item-title">Coffee</span>
                </div>
                <span class="cart-price cart-column">$6.99</span>
                    <div class="cart-quantity cart-column">
                        <input class="cart-quantity-input" min="1" type="number" value="1">
                        <button class="btn btn-danger" type="button">REMOVE</button>
                    </div>
                </div>
            `;
        });
    });



}
cargarServicios();
