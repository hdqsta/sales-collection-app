/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx", // <--- Pastikan ini ada untuk React
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
