/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                'card-inset': 'inset 0 0px 16px 0px rgba(0, 0, 0, 0.05)',
                card: '0 0px 16px 0px rgba(0, 0, 0, 0.02)'
            },
            backgroundColor: {
                side: 'rgb(232 234 236)'
            }
        }
    },
    plugins: []
}
