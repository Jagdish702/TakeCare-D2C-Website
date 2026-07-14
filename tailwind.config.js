/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Figma: Blue Primary/Brand
        'brand-blue': '#004172',
        // Figma: Black/6 (inactive nav + icon stroke/fill)
        'nav-inactive': '#999999',
        // Figma: Error/Dark (notification badge)
        badge: '#d82525',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        // Figma: Web/Button letterSpacing 1.62% of 16px
        nav: '0.2592px',
        badge: '0.2589px',
      },
      lineHeight: {
        badge: '13.333px',
      },
      boxShadow: {
        // Figma effect style: Outer/5
        header:
          '0px 2px 16px 0px rgba(0,65,114,0.08), inset 0px 0px 2px 0px rgba(0,65,114,0.16)',
        // drop-shadow on bell + profile icons
        icon: '0px 2px 8px rgba(0,65,114,0.08)',
      },
    },
  },
  plugins: [],
};
