/** @type {import('tailwindcss').Config} */
// Misma configuracion que tenia el CDN dentro de index.html.
// Tailwind lee index.html para saber que clases estas usando y generar SOLO esas.
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "-apple-system", "sans-serif"] },
    },
  },
  plugins: [],
};
