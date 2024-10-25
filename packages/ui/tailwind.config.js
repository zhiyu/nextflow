/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                main: '0 -5px 16px 0px rgba(0, 0, 0, 0.05)'
            },
            backgroundColor: {
                side: 'rgb(232 234 236)'
            }
        }
    },
    plugins: []
}
