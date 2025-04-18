/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "colorPrincipal":'#333',
        "colorSecundario":'#161C22' //color de columna
      }
    },
  },
  plugins: [],
}

