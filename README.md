# Shift Digital — Landing

Landing page de Shift Digital: automatización de turnos para negocios locales.

## Cómo editar

Editás **un solo archivo: `index.html`**. Todo está ahí adentro, y arriba de todo
hay un bloque `CONFIGURACION` con lo que se cambia más seguido:

| Constante | Qué controla |
|---|---|
| `WHATSAPP_NUMERO` | El número al que escriben los clientes (formato internacional, sin `+`, sin `0` y sin `15`) |
| `WHATSAPP_MENSAJE` | El texto que aparece ya escrito al abrir el chat |
| `LINK_ASESORIA` | Adónde va el botón "Agendar asesoría" (por defecto, al mismo WhatsApp) |
| `VIDEO_HERO` / `POSTER_HERO` | El video que se ve arriba de todo |
| `PROYECTOS` | Las tarjetas del portafolio |

Para verlo mientras trabajás, abrí `index.html` con doble clic. En ese modo
Tailwind y React se compilan en el navegador: cómodo para iterar, lento para
publicar. Por eso existe el build.

## Publicar un cambio

```bash
npm run build
```

Eso genera `/dist`, que es lo que se publica. **No edites `/dist` a mano**: se
regenera entero en cada build. Después:

```bash
git add -A
git commit -m "Actualizo la landing"
git push
```

Vercel detecta el push, corre el build solo y actualiza el sitio.

### Qué hace el build

Reemplaza las librerías que compilaban en el navegador del visitante por
archivos ya compilados:

| | Modo edición | Publicado |
|---|---|---|
| Tailwind | CDN, ~400 KB | `assets/styles.css`, 18 KB |
| JSX | Babel en el navegador, ~1,5 MB | `assets/app.js`, 33 KB |
| React | CDN (versión fija) | CDN (versión fija) |

## Videos

- `portfolio/web/` — las versiones optimizadas (720p, 30fps, sin audio) que usa
  la página. **Estas se suben al repo.**
- `portfolio/*.mp4` — los originales en 1080p60. Están en `.gitignore`: no se
  suben, pero quedan en tu disco. Si cambiás de máquina, copialos aparte.

Para agregar un proyecto nuevo: poné el video optimizado y su poster en
`portfolio/web/` y sumá un objeto a `PROYECTOS` en `index.html`.

## Estructura

```
index.html          ← el único archivo que editás
build.mjs           ← genera /dist para producción
src/input.css       ← entrada de Tailwind (no se toca)
tailwind.config.js
vercel.json         ← configuración del deploy
portfolio/web/      ← videos y posters del portafolio
logo/               ← manual de identidad (la web usa la Opción 3)
```
