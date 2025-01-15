# SportLink-web (React + TypeScript + Vite)

I currently set this up to have a mantine App and Home page, with an open API call for an example.

## Tech Stack

- React + TypeScript, Vite, Mantine UI frontend component library, Axios, PostCSS

## Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
### Windows
- Download Node.js installer from nodejs.org and run installer, **npm** comes included
### Mac
- brew install node    # Using Homebrew
### Linux
- ovi se znaju snac sami bez uputa


## Setup

1. Create a `.env.development` file in the root directory:
```
# .env.development
# VITE_API_URL=http://localhost:5000

VITE_API_URL=https://dog.ceo/api/breeds/image/random
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will start at url visible in the terminal, EXAMPLE output below:
```
  VITE v5.4.10  ready in 302 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── services/      # API services
  │   └── api.ts     # API configuration
  ├── App.tsx        # Root component
  └── main.tsx       # Entry point
```

## Development

1. The main page component is in `src/pages/Home.tsx`
2. API configuration is in `src/services/api.ts`
3. Mantine UI components are used for the interface
4. TODO: see if we need ESLint configured for code quality

## Building for Production

1. Update the `.env` file with your production API URL if needed
2. Run the build command:
```bash
npm run build
```
3. The built files will be in the `dist` directory

## Common Issues

1. If you see API errors, make sure your `.env` file is set up correctly
2. If styles aren't loading, check that PostCSS is configured properly
3. For TypeScript errors, ensure all dependencies are properly installed

## License

[Your chosen license]



---
## Default README:
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
