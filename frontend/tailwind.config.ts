import type { Config } from 'tailwindcss';

const config: Config = {
    corePlugins: {
        container: false,
    },
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-roboto-flex)', 'ui-sans-serif', 'system-ui', 'serif'],
                headings: ['var(--font-poppins)', 'sans-serif'],
            },
            screens: {
                xxl: '1400px',
            },
        },
    },
    plugins: [],
};

export default config;
