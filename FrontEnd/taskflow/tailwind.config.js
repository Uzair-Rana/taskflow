/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f5fbff',
                    100: '#eaf5ff',
                    200: '#cfeaff',
                    300: '#a7dbff',
                    400: '#6fc3ff',
                    500: '#2aa8ff',
                    600: '#1586e7',
                    700: '#0e66b6',
                    800: '#0f4a84',
                    900: '#0f355d',
                },
                accent: {
                    50: '#fbf7ff',
                    100: '#f5ecff',
                    200: '#ead8ff',
                    300: '#d3b2ff',
                    400: '#b37eff',
                    500: '#8e45ff',
                    600: '#7429f0',
                    700: '#5c1cc1',
                    800: '#451492',
                    900: '#32106a',
                },
            },
            boxShadow: {
                soft: '0 2px 12px rgba(15, 53, 93, 0.08)',
                hover: '0 6px 20px rgba(15, 53, 93, 0.12)',
            },
            borderRadius: {
                xl: '1rem',
                '2xl': '1.25rem',
            },
        },
    },
    plugins: [],
}
