document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formVideojuego');
    const msgBox = document.getElementById('msgAjax');

    if (!form || !msgBox) return;

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        msgBox.style.display = 'none';
        msgBox.className = '';
        msgBox.innerHTML = '';

        const formData = new FormData(form);
        const datos = {
            titulo: formData.get('titulo'),
            plataforma: formData.get('plataforma'),
            genero: formData.get('genero'),
            estado: formData.get('estado'),
            imagen: formData.get('imagen')
        };

        try {
            const respuesta = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const data = await respuesta.json();

            if (!respuesta.ok || !data.ok) {
                const errorMsg = data && data.error ? data.error : 'Error al guardar el videojuego';
                msgBox.className = 'alert alert-danger';
                msgBox.textContent = errorMsg;
                msgBox.style.display = 'block';
                return;
            }

            msgBox.className = 'alert alert-success';
            msgBox.textContent = 'Videojuego guardado correctamente. Redirigiendo...';
            msgBox.style.display = 'block';

            setTimeout(() => {
                window.location.href = '/admin';
            }, 800);
        } catch (err) {
            console.error(err);
            msgBox.className = 'alert alert-danger';
            msgBox.textContent = 'Se ha producido un error inesperado. Inténtalo de nuevo.';
            msgBox.style.display = 'block';
        }
    });
});
