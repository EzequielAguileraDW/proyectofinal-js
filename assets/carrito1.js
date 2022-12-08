let divservicios = document.getElementById('divservicios');
let carrito = [];
let total = 0;
let totalElement = document.querySelector('.carrito-total-title');
let inputNumber = document.querySelectorAll('.carrito-cantidad-input');


fetch('./servicios.json')
    .then(response => response.json())
    .then(servicios => {
        servicios.forEach(servicio => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML += `
                    <div id="${servicio.id}">
                        <img class="servicio-img" src="${servicio.img}" alt="${servicio.nombre}">
                        <div class="servicio-detalle">
                            <h2 class="servicio-nombre">${servicio.nombre}</h2>
                            <b class="servicio-precio">$${servicio.precio}</b>
                            <button class="servicio-agregar" id="agregar${servicio.id}">Agregar</button>
                        </div>
                    </div>
                    `;
            divservicios.append(div);
        });

        let btnsAdd = document.getElementsByClassName('servicio-agregar');
        btnsAdd = [...btnsAdd];

        let carritoServicios = document.querySelector('.carrito-servicios');

        btnsAdd.forEach(btn => {
            btn.addEventListener('click', e => {

                let actualId = parseInt(e.target.parentNode.parentNode.id);

                //Buscar objeto actual
                let actualProd = servicios.find(item => item.id === actualId);
                if (actualProd.quantity === undefined) {
                    actualProd.quantity = 1;
                }


                //Verificar si existe el servicio
                let existe = false;
                carrito.forEach(serv => {
                    if (actualId == serv.id) {
                        existe = true;
                    }
                })

                if (existe) {
                    actualProd.quantity++;
                } else {
                    carrito.push(actualProd);
                }

                localStorage.setItem("servicio-carrito", JSON.stringify(carrito));
        

                mostrar();
                getTotal();
                removerItems();
            });

            btn.addEventListener('click', () => {
                Toastify({
                    text: "Servicio agregado!",
                    duration: 3000,
                    gravity: 'bottom',
                }).showToast();
            })

        });


        //Modificar DOM con servicios agregados al carrito
        function mostrar() {
            carritoServicios.innerHTML = '';
            carrito.forEach(item => {
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
            })
            removerItems();
        }


        //Mostrar total
        function getTotal() {
            let sumTotal;
            total = carrito.reduce((sum, item) => {
                sumTotal = sum + item.quantity * item.precio;
                return sumTotal;
            }, 0);
            totalElement.innerHTML = `Total $${total}`
        }


        //Remover servicios de carrito
        function removerItems() {
            let removeBtn = document.querySelectorAll('.btn-eliminar');
            removeBtn = [...removeBtn];
            removeBtn.forEach(btn => {
                btn.addEventListener('click', e => {
                    let actualServ = e.target.parentElement.parentElement.childNodes[1].innerText;
                    let actualServObject = carrito.find(item => item.nombre == actualServ);

                    carrito = carrito.filter(item => item != actualServObject);
                    mostrar();
                    getTotal();
                })
                btn.addEventListener('click', ()=>{
                    Toastify({
                        text: "Servicio quitado!",
                        duration: 3000,
                        gravity: 'bottom',
                        style: {
                            background: "red",
                        }
                    }).showToast();
                })


            })


        }

    });

