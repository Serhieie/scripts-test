/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './components/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Variants
        shadowBoxDark: '#020617',

        lightPartsColorDark: 'rgb(7, 33, 78)',
        darkFontDark: '#94A3B8',

        gradientColor1Dark: 'rgb(3, 3, 4)',
        gradientColor2Dark: 'rgb(22, 26, 56)',
        smallWraperGradient1Dark: '#0F172A',
        smallWraperGradient2Dark: '#0F172c',

        buttonColorDark: 'rgb(14, 68, 115)',
        buttonHoverColorDark: 'rgb(56, 154, 240)',
        buttonShadowBoxDark: 'rgb(180, 200, 220)',
        buttonTextColorDark: 'rgb(176, 198, 238)',
        themeBtnLight: 'rgb(250, 250, 210)',
      },

      screens: {
        '2xl': { max: '1535px' },
        xl: { max: '1279px' },
        lg: { max: '1023px' },
        md: { max: '767px' },
        sm: { max: '639px' },
        ssm2: { max: '550px' },
        ssm: { max: '375px' },
        sm2: { min: '640px', max: '767px' },
        md2: { min: '768px', max: '1023px' },
        md3: { min: '768px' },
        mmd2: { min: '900px', max: '1265px' },
        lg2: { min: '1024px', max: '1360px' },
        xl2: { min: '1280px', max: '1535px' },
        '1xl2': { min: '1265px' },
        '2xl2': { min: '1536px' },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
