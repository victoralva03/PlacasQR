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

## Probar en tu computadora

Necesitas servir la carpeta `public` (no abrir los archivos con doble clic):

```
npx wrangler dev
```

o con la extensión Live Server de VS Code, haciendo clic derecho sobre
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

## Antes de vender (pendiente)

- Comprar un dominio y usarlo en todos los QR.
- Reemplazar los 3 memoriales de ejemplo con fotos y datos de prueba propios.
- Imprimir un QR de prueba y leerlo con varios celulares.
