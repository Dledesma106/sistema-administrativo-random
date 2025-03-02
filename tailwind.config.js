import scrollbar from 'tailwind-scrollbar';
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
const config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem',
            screens: {
                '2xl': '1400px',
                '3xl': '1600px',
                '4xl': '1800px',
                '5xl': '2000px',
            },
        },
        extend: {
            screens: {
                '2xl': '1400px',
                '3xl': '1600px',
                '4xl': '1800px',
                '5xl': '2000px',
            },
            fontFamily: {
                sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(168, 37%, 46%)',
                background: {
                    DEFAULT: 'hsl(var(--background))',
                    primary: 'hsl(var(--background-primary))',
                },
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(168, 37%, 46%)',
                    foreground: 'hsl(0 0% 87%)',
                },
                secondary: {
                    DEFAULT: 'hsl(0, 0%, 87%)',
                    foreground: 'hsl(0 0% 12%)',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: {
                        DEFAULT: 'hsl(var(--muted-foreground))',
                        dark: 'hsl(0 0% 80%)',
                    },
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: {
                        DEFAULT: 'hsl(var(--accent-foreground))',
                        dark: 'hsl(0 0% 100%)',
                    },
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                success: {
                    DEFAULT: 'hsl(143.9, 93.8%, 38.2%)',
                    foreground: 'hsl(138.5 76.5% 96.7%)',
                },
                light: {
                    primary: 'hsl(var(--light-primary))',
                    secondary: 'hsl(var(--light-secondary))',
                    background: 'hsl(var(--light-background))',
                    foreground: 'hsl(var(--light-foreground))',
                    muted: 'hsl(var(--light-muted))',
                    accent: 'hsl(var(--light-accent))',
                    border: 'hsl(var(--light-border))',
                },
                dark: {
                    primary: {
                        DEFAULT: 'hsl(168, 37%, 46%)',
                        foreground: 'hsl(0 0% 100%)',
                    },
                    secondary: {
                        DEFAULT: 'hsl(0, 0%, 87%)',
                        foreground: 'hsl(0 0% 100%)',
                    },
                    accent: {
                        DEFAULT: 'hsl(240, 2%, 19%)',
                        foreground: 'hsl(0 0% 12%)',
                    },
                    background: 'hsl(var(--dark-background))',
                    foreground: 'hsl(var(--dark-foreground))',
                    muted: 'hsl(var(--dark-muted))',
                    border: 'hsl(var(--dark-border))',
                },
                skeleton: {
                    DEFAULT: 'hsl(var(--skeleton))',
                    foreground: 'hsl(var(--skeleton-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [animate, scrollbar({ nocompatible: true })],
};

export default config;
