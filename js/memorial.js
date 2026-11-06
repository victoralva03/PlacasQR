
const PARAMETROS = new URLSearchParams(window.location.search);
const ID_MEMORIAL = PARAMETROS.get("id");

const TEMAS_PERMITIDOS = [
    "elegante",
    "clasico",
    "moderno"
];

async function cargarMemorial() {

    const error = document.getElementById("error");

    try {

        if (!ID_MEMORIAL) {
            throw new Error("No se indicó un memorial");
        }

        const respuesta = await fetch("/data/memoriales.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la información");
        }

        const memoriales = await respuesta.json();

        const memorial = memoriales.find(
            item => item.id === ID_MEMORIAL
        );

        if (!memorial) {
            throw new Error("Memorial no encontrado");
        }

        mostrarMemorial(memorial);

    } catch (err) {

        console.error(err);

        document.querySelector(".memorial-container").hidden = true;
        error.hidden = false;

        document.title = "Memorial no encontrado | Memorias Perú";
    }
}


function formatearFecha(fecha) {

    if (!fecha) return "";

    const partes = fecha.split("-");

    if (partes.length !== 3) return fecha;

    const fechaValida = new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );

    return fechaValida.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


function mostrarMemorial(persona) {

    // Seleccionar diseño
    const tema = TEMAS_PERMITIDOS.includes(persona.tema)
        ? persona.tema
        : "elegante";

    document.body.className = `theme-${tema}`;

    // Personalización de colores
const validarColor = (color, predeterminado) => {
    return typeof color === "string" &&
        /^#[0-9A-Fa-f]{6}$/.test(color)
        ? color
        : predeterminado;
};

const colores = {
    elegante: {
        fondo: "#f7f4ed",
        acento: "#ae8954"
    },
    clasico: {
        fondo: "#172333",
        acento: "#c5a96d"
    },
    moderno: {
        fondo: "#ffffff",
        acento: "#527b91"
    }
};

const base = colores[tema];

document.body.style.setProperty(
    "--background",
    validarColor(persona.colorFondo, base.fondo)
);

document.body.style.setProperty(
    "--accent",
    validarColor(persona.colorAcento, base.acento)
);

// Frases personalizadas
document.getElementById("frase").textContent =
    persona.frase || "Tu recuerdo vivirá eternamente en nuestros corazones.";

document.getElementById("dedicatoria").textContent =
    persona.dedicatoria ||
    "Aunque ya no estés físicamente con nosotros, tu historia seguirá viviendo en quienes te amaron.";

// Mostrar u ocultar galería
const mostrarGaleria = persona.mostrarGaleria !== false;

    // Información principal
    document.title = `${persona.nombre} | Memorias Perú`;

    document.getElementById("nombre").textContent =
        persona.nombre || "Sin nombre";

    document.getElementById("nacimiento").textContent =
        formatearFecha(persona.nacimiento);

    document.getElementById("fallecimiento").textContent =
        formatearFecha(persona.fallecimiento);

    document.getElementById("biografia").textContent =
        persona.biografia || "Su historia permanecerá en nuestros corazones.";

    // Fotografía principal
    const foto = document.getElementById("foto-principal");

    foto.src = persona.foto || "";
    foto.onerror = () => {
        foto.style.display = "none";
    };

    // Galería
    const galeria = document.getElementById("galeria");
    const seccionGaleria = document.getElementById("galeria-section");

    galeria.innerHTML = "";

    const fotografias = Array.isArray(persona.galeria)
        ? persona.galeria
        : [];

   if (!mostrarGaleria || fotografias.length === 0) {
        seccionGaleria.hidden = true;
    } else {

        seccionGaleria.hidden = false;

        fotografias.forEach((ruta, indice) => {

            const imagen = document.createElement("img");

            imagen.src = ruta;
            imagen.alt = `Recuerdo ${indice + 1}`;
            imagen.loading = "lazy";

            imagen.onerror = () => {
                imagen.remove();
            };

            imagen.addEventListener("click", () => {
                abrirImagen(ruta);
            });

            galeria.appendChild(imagen);
        });
    }
}


// Ampliar fotografías
function abrirImagen(ruta) {

    const modal = document.getElementById("image-modal");
    const imagen = document.getElementById("modal-image");

    imagen.src = ruta;
    modal.hidden = false;
}


// Cerrar fotografía
document.getElementById("close-modal").addEventListener("click", () => {

    document.getElementById("image-modal").hidden = true;

    document.getElementById("modal-image").src = "";
});

document.getElementById("image-modal").addEventListener("click", (evento) => {

    if (evento.target.id === "image-modal") {

        evento.currentTarget.hidden = true;
        document.getElementById("modal-image").src = "";

    }
});


// Iniciar plataforma
cargarMemorial();
