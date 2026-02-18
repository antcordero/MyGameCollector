(function () {
    const CLAVE_FAVORITOS = 'favoritosVideojuegos';
    const CLAVE_MODO = 'mostrarSoloFavoritos';

    function obtenerFavoritos() {
        const datos = localStorage.getItem(CLAVE_FAVORITOS);
        if (!datos) return [];
        try {
            const arr = JSON.parse(datos);
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    }

    function guardarFavoritos(lista) {
        localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(lista));
    }

    function esFavorito(id, lista) {
        return lista.includes(String(id));
    }

    function marcarIcono(btn, activo) {
        const icon = btn.querySelector('.star-icon');
        if (!icon) return;
        if (activo) {
            icon.classList.remove('bi-star');
            icon.classList.add('bi-star-fill', 'text-warning');
        } else {
            icon.classList.add('bi-star');
            icon.classList.remove('bi-star-fill', 'text-warning');
        }
    }

    function aplicarEstadoInicialFavoritos() {
        const favoritos = obtenerFavoritos();
        const botones = document.querySelectorAll('.boton-favorito');
        botones.forEach(btn => {
            const id = btn.dataset.id;
            marcarIcono(btn, esFavorito(id, favoritos));
        });
    }

    function aplicarFiltroSoloFavoritos(activar) {
        const favoritos = obtenerFavoritos();
        const filas = document.querySelectorAll('.fila-videojuego');

        filas.forEach(fila => {
            const id = fila.dataset.id;
            if (activar && favoritos.length > 0 && !esFavorito(id, favoritos)) {
                fila.classList.add('d-none');
            } else {
                fila.classList.remove('d-none');
            }
        });

        localStorage.setItem(CLAVE_MODO, activar ? 'true' : 'false');
    }

    function aplicarModoGuardado() {
        let modo = localStorage.getItem(CLAVE_MODO);
        const favoritos = obtenerFavoritos();
      
        //si no hay modo guardado pero sí hay favoritos, por defecto solo favoritos
        if (modo === null && favoritos.length > 0) {
          modo = 'true';
        }
      
        const soloFav = modo === 'true';
        aplicarFiltroSoloFavoritos(soloFav);
      
        const btnSolo = document.getElementById('btnSoloFavoritos');
        const btnTodos = document.getElementById('btnTodosJuegos');
        if (btnSolo && btnTodos) {
          btnSolo.classList.toggle('active', soloFav);
          btnTodos.classList.toggle('active', !soloFav);
        }
      }
      

    document.addEventListener('DOMContentLoaded', function () {
        const contenedorAdmin = document.querySelector('.fila-videojuego') || document.getElementById('btnSoloFavoritos');
        if (!contenedorAdmin) return;

        aplicarEstadoInicialFavoritos();
        aplicarModoGuardado();

        const botonesFav = document.querySelectorAll('.boton-favorito');
        botonesFav.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                let favoritos = obtenerFavoritos();

                if (esFavorito(id, favoritos)) {
                    favoritos = favoritos.filter(x => x !== String(id));
                    marcarIcono(this, false);
                } else {
                    favoritos.push(String(id));
                    marcarIcono(this, true);
                }

                guardarFavoritos(favoritos);

                const modo = localStorage.getItem(CLAVE_MODO);
                if (modo === 'true') {
                    aplicarFiltroSoloFavoritos(true);
                }
            });
        });

        const btnSolo = document.getElementById('btnSoloFavoritos');
        const btnTodos = document.getElementById('btnTodosJuegos');

        if (btnSolo) {
            btnSolo.addEventListener('click', function () {
                aplicarFiltroSoloFavoritos(true);
                btnSolo.classList.add('active');
                if (btnTodos) btnTodos.classList.remove('active');
            });
        }

        if (btnTodos) {
            btnTodos.addEventListener('click', function () {
                aplicarFiltroSoloFavoritos(false);
                btnTodos.classList.add('active');
                if (btnSolo) btnSolo.classList.remove('active');
            });
        }
    });
})();
