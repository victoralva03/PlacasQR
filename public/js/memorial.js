(() => {
    "use strict";

    // El código del memorial solo puede tener minúsculas, números y guiones.
    // Esto evita que alguien pida otros archivos del sitio usando el parámetro ?id=
    const ID_VALIDO = /^[a-z0-9][a-z0-9-]{2,63}$/;

    const PARAMETROS = new URLSearchParams(window.location.search);
    const ID_MEMORIAL = (PARAMETROS.get("id") || "").trim().toLowerCase();

    const TEMAS = {
        elegante: { fondo: "#f7f4ed", acento: "#ae8954", oscuro: false },
        clasico:  { fondo: "#172333", acento: "#c5a96d", oscuro: true },
        moderno:  { fondo: "#ffffff", acento: "#527b91", oscuro: false }
    };

    // Colores de texto según el fondo, para que siempre se pueda leer
    const TEXTO_SOBRE_CLARO = {
        "--heading": "#2b2b2b",
        "--text": "#4a4a4a",
        "--muted": "#6e6e6e",
        "--border": "rgba(0, 0, 0, 0.12)",
        "--surface": "rgba(0, 0, 0, 0.06)",
        "--panel": "rgba(0, 0, 0, 0.04)",
        "--photo-border": "#ffffff",
        "--shadow": "0 8px 25px rgba(0, 0, 0, 0.10)"
    };

    const TEXTO_SOBRE_OSCURO = {
        "--heading": "#f3efe6",
        "--text": "#d8dce2",
        "--muted": "#aeb7c2",
        "--border": "rgba(255, 255, 255, 0.18)",
        "--surface": "rgba(255, 255, 255, 0.08)",
        "--panel": "rgba(255, 255, 255, 0.05)",
        "--photo-border": "rgba(255, 255, 255, 0.35)",
        "--shadow": "0 10px 35px rgba(0, 0, 0, 0.35)"
    };

    const VARIABLES_PERSONALIZADAS = [
        "--background", "--accent",
        ...Object.keys(TEXTO_SOBRE_CLARO)
    ];

    const MODO_VISTA_PREVIA = PARAMETROS.get("preview") === "1";

    const $ = (id) => document.getElementById(id);

    let elementoConFoco = null;


    /* ---------- Utilidades ---------- */

    function colorValido(color) {
        return typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color.trim());
    }

    // Luminancia relativa (0 = negro, 1 = blanco)
    function luminancia(hex) {
        const canales = [1, 3, 5].map((i) => {
            const c = parseInt(hex.slice(i, i + 2), 16) / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2];
    }

    function formatearFecha(fecha) {
        if (!fecha) return "";

        const partes = fecha.split("-");
        if (partes.length !== 3) return fecha;

        const f = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
        if (Number.isNaN(f.getTime())) return fecha;

        return f.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    // Las fotos pueden ser un nombre de archivo ("principal.jpg"), que se busca en
    // /images/memoriales/<id>/, o un enlace https:// completo.
    function rutaImagen(valor, id) {
        if (typeof valor !== "string") return "";

        const v = valor.trim();
        if (!v) return "";

        if (/^https:\/\//i.test(v)) return v;
        if (v.includes("/") || v.includes("\\") || v.includes("..")) return "";

        return `/images/memoriales/${id}/${encodeURIComponent(v)}`;
    }


    /* ---------- Carga ---------- */

    async function cargarMemorial() {
        try {
            if (!ID_VALIDO.test(ID_MEMORIAL)) {
                throw new Error("Código de memorial no válido");
            }

            const respuesta = await fetch(`/data/memoriales/${ID_MEMORIAL}.json`);

            if (!respuesta.ok) {
                throw new Error("Memorial no encontrado");
            }

            const memorial = await respuesta.json();

            mostrarMemorial(memorial, ID_MEMORIAL);

        } catch (err) {
            console.error(err);

            $("cargando").hidden = true;
            document.querySelector(".memorial-container").hidden = true;
            $("error").hidden = false;

            document.body.className = "theme-elegante";
            document.title = "Memorial no encontrado | Memorias Perú";
        }
    }


    /* ---------- Mostrar ---------- */

    function aplicarTema(persona) {
        const tema = TEMAS[persona.tema] ? persona.tema : "elegante";
        const base = TEMAS[tema];

        document.body.className = `theme-${tema}`;

        // Limpia colores de una aplicación anterior (necesario en la vista previa)
        VARIABLES_PERSONALIZADAS.forEach((v) => document.body.style.removeProperty(v));

        const tieneFondoPropio = colorValido(persona.colorFondo);
        const fondo = tieneFondoPropio ? persona.colorFondo.trim() : base.fondo;
        const acento = colorValido(persona.colorAcento) ? persona.colorAcento.trim() : base.acento;

        document.body.style.setProperty("--background", fondo);
        document.body.style.setProperty("--accent", acento);

        // Con un fondo personalizado, se recalculan los colores de texto
        // según si el fondo es claro u oscuro.
        if (tieneFondoPropio) {
            const fondoOscuro = luminancia(fondo) < 0.4;
            const paleta = fondoOscuro ? TEXTO_SOBRE_OSCURO : TEXTO_SOBRE_CLARO;

            Object.entries(paleta).forEach(([variable, valor]) => {
                document.body.style.setProperty(variable, valor);
            });
        }
    }

    function mostrarMemorial(persona, id) {
        aplicarTema(persona);

        document.title = `${persona.nombre || "Memorial"} | Memorias Perú`;

        $("nombre").textContent = persona.nombre || "Sin nombre";
        $("nacimiento").textContent = formatearFecha(persona.nacimiento);
        $("fallecimiento").textContent = formatearFecha(persona.fallecimiento);

        $("frase").textContent =
            persona.frase || "Tu recuerdo vivirá eternamente en nuestros corazones.";

        $("biografia").textContent =
            persona.biografia || "Su historia permanecerá en nuestros corazones.";

        $("dedicatoria").textContent =
            persona.dedicatoria ||
            "Aunque ya no estés físicamente con nosotros, tu historia seguirá viviendo en quienes te amaron.";

        mostrarFotoPrincipal(persona, id);
        mostrarGaleria(persona, id);

        $("cargando").hidden = true;
        document.querySelector(".memorial-container").hidden = false;
    }

    function mostrarFotoPrincipal(persona, id) {
        const contenedor = $("portrait");
        const foto = $("foto-principal");
        const ruta = rutaImagen(persona.foto, id);

        if (!ruta) {
            contenedor.hidden = true;
            return;
        }

        foto.alt = `Fotografía de ${persona.nombre || "la persona homenajeada"}`;
        foto.onerror = () => { contenedor.hidden = true; };
        foto.src = ruta;
        contenedor.hidden = false;
    }

    function mostrarGaleria(persona, id) {
        const galeria = $("galeria");
        const seccion = $("galeria-section");

        galeria.innerHTML = "";

        const rutas = (Array.isArray(persona.galeria) ? persona.galeria : [])
            .map((nombre) => rutaImagen(nombre, id))
            .filter(Boolean);

        if (persona.mostrarGaleria === false || rutas.length === 0) {
            seccion.hidden = true;
            return;
        }

        seccion.hidden = false;

        rutas.forEach((ruta, indice) => {
            const imagen = document.createElement("img");

            imagen.src = ruta;
            imagen.alt = `Recuerdo ${indice + 1}`;
            imagen.loading = "lazy";
            imagen.tabIndex = 0;
            imagen.setAttribute("role", "button");

            imagen.onerror = () => {
                imagen.remove();
                if (galeria.children.length === 0) seccion.hidden = true;
            };

            imagen.addEventListener("click", () => abrirImagen(ruta, imagen.alt));
            imagen.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    abrirImagen(ruta, imagen.alt);
                }
            });

            galeria.appendChild(imagen);
        });
    }


    /* ---------- Ventana para ampliar fotos ---------- */

    function abrirImagen(ruta, descripcion) {
        elementoConFoco = document.activeElement;

        $("modal-image").src = ruta;
        $("modal-image").alt = descripcion || "Fotografía ampliada";
        $("image-modal").hidden = false;
        $("close-modal").focus();
    }

    function cerrarImagen() {
        $("image-modal").hidden = true;
        $("modal-image").src = "";

        if (elementoConFoco && typeof elementoConFoco.focus === "function") {
            elementoConFoco.focus();
        }
    }

    $("close-modal").addEventListener("click", cerrarImagen);

    $("image-modal").addEventListener("click", (e) => {
        if (e.target.id === "image-modal") cerrarImagen();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !$("image-modal").hidden) cerrarImagen();
    });


    /* ---------- Vista previa (la usa el panel local) ---------- */

    // Con ?preview=1 la página no busca ningún archivo: espera los datos
    // que le envía el panel y los dibuja. Solo muestra texto y fotos ya validados.
    function iniciarVistaPrevia() {
        $("cargando").textContent = "Esperando datos del panel…";

        window.addEventListener("message", (e) => {
            const msg = e.data;
            if (!msg || msg.tipo !== "memorial-preview") return;
            if (!msg.memorial || typeof msg.memorial !== "object") return;

            const id = ID_VALIDO.test(String(msg.memorial.id || ""))
                ? msg.memorial.id
                : "vista-previa";

            mostrarMemorial(msg.memorial, id);
        });

        if (window.parent !== window) {
            window.parent.postMessage({ tipo: "preview-listo" }, "*");
        }
    }

    if (MODO_VISTA_PREVIA) {
        iniciarVistaPrevia();
    } else {
        cargarMemorial();
    }
})();
