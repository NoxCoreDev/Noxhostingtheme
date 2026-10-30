const colors = require('tailwindcss/colors');

// NOX HOSTING palette: midnight navy surfaces, blue accents, white text
const noxBlue = {
    50: '#eaf4fd', 100: '#cfe6fa', 200: '#a4d0f5', 300: '#6fb6ee',
    400: '#11a5ed', 500: '#0872d4', 600: '#0961b3', 700: '#074c8c',
    800: '#06366a', 900: '#042446',
};

// Navy scale kept for the login page (unchanged look)
const navy = {
    50: 'hsl(216, 33%, 97%)', 100: 'hsl(214, 15%, 91%)', 200: 'hsl(210, 16%, 82%)',
    300: 'hsl(211, 13%, 65%)', 400: 'hsl(211, 10%, 53%)', 500: 'hsl(211, 12%, 43%)',
    600: 'hsl(209, 14%, 37%)', 700: 'hsl(209, 18%, 30%)', 800: 'hsl(209, 20%, 25%)',
    900: 'hsl(210, 24%, 16%)',
};

// NOX HOSTING panel palette: black, charcoal and red accents
const redAccent = {
    50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
    500: '#dc2626', 600: '#b91c1c', 700: '#991b1b', 800: '#7f1d1d', 900: '#450a0a',
};

const gray = {
    50: '#f5f5f5',
    100: '#e5e5e5',
    200: '#d4d4d4',
    300: '#a3a3a3',
    400: '#737373',
    500: '#525252',
    600: '#404040',
    700: '#262626',
    800: '#1a1a1a',
    900: '#0f0f0f',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#0a0a0a',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: redAccent,
                navy: navy,
                nox: noxBlue,
                gray: gray,
                neutral: gray,
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
