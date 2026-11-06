# Memorias Perú – Placas QR

Páginas de memorial para placas con código QR. Cada placa abre una página con la
biografía y las fotos de una persona.

## Estructura

```
public/                 <- Lo único que se publica en internet
  index.html            Página de inicio
  memorial.html         Plantilla del memorial (?id=CODIGO)
  404.html              Página de error
  css/styles.css        Estilos y los 3 temas
  js/memorial.js        Carga los datos y aplica el tema
  data/memoriales/      Un archivo .json por cada memorial
  images/memoriales/    Una carpeta por memorial, con sus fotos
admin/index.html        Panel local para crear memoriales (NO se publica)
wrangler.jsonc          Configuración de Cloudflare
```

## Agregar un cliente nuevo

1. Abre `admin/index.html` con doble clic en tu navegador.
2. Llena los datos y pulsa **Generar memorial**.
3. Descarga el archivo y guárdalo en `public/data/memoriales/`.
4. Crea la carpeta `public/images/memoriales/<codigo>/` y copia las fotos
   (la principal se llama `principal.jpg`, o el nombre que hayas puesto).
5. Haz commit y push. Cloudflare publica solo.
6. Abre el enlace en el celular, revisa que todo se vea bien y recién entonces
   genera el QR con ese enlace.

El código (por ejemplo `maria-fernandez-4kq8z2`) lleva letras al azar a propósito:
así nadie puede adivinar los memoriales de otras familias. No lo cambies una vez
que el QR esté grabado.

## Vista previa en el panel

El panel muestra un celular a la derecha que se actualiza mientras escribes, para
elegir tema y colores con el cliente al lado. Para que funcione:

1. Deja el sitio corriendo en VS Code (Live Server o `npx wrangler dev`).
2. En el panel, en "Sitio abierto en tu computadora", escribe esa dirección
   (normalmente http://127.0.0.1:5500).

Las fotos aparecen en la vista previa cuando ya están copiadas en
`public/images/memoriales/<codigo>/`.

## Botón de WhatsApp (opcional)

En `public/index.html`, busca `var WHATSAPP = "";` y escribe tu número con código
de país, sin espacios ni signos (Perú: `51987654321`). Si queda vacío, no se muestra.

## Probar en tu computadora

Necesitas servir la carpeta `public` (no abrir los archivos con doble clic):

```
npx wrangler dev
```

o con la extensión Live Server de VS Code (ya viene configurada en
`.vscode/settings.json` para servir la carpeta `public`): clic derecho sobre
`public/index.html` > Open with Live Server.

Enlaces de prueba:
- /memorial.html?id=maria-fernandez-4kq8z2
- /memorial.html?id=carlos-ramirez-9tm3xw
- /memorial.html?id=jose-mendoza-7bn5vr

## Campos del memorial

| Campo | Descripción |
|---|---|
| id | Código único. Debe coincidir con el nombre del archivo. |
| nombre, nacimiento, fallecimiento | Fechas en formato AAAA-MM-DD |
| biografia | Texto. Una línea en blanco separa párrafos. |
| frase, dedicatoria | Si se dejan vacíos se usa un texto por defecto |
| foto | Nombre del archivo en la carpeta del memorial |
| galeria | Lista de nombres de archivo |
| mostrarGaleria | true o false |
| tema | elegante, clasico o moderno |
| colorFondo, colorAcento | Vacío = color del tema. El texto se ajusta solo al fondo. |

## Lista de pruebas antes de vender una placa

- El QR se lee con al menos 3 celulares distintos (Android y iPhone).
- Se lee con sol directo, a la sombra y de noche con la luz del celular.
- Se lee a unos 30 cm y a unos 60 cm.
- Se lee con la placa mojada y con un poco de polvo o tierra.
- Se lee con la cámara normal, sin una app especial.
- El enlace del QR abre el memorial correcto y se ve bien en el celular.
- Cuando la foto no carga, la página sigue viéndose bien.

## Antes de vender (pendiente)

- Comprar un dominio y usarlo en todos los QR.
- Reemplazar los 3 memoriales de ejemplo con fotos y datos de prueba propios.
- Imprimir un QR de prueba y leerlo con varios celulares.
