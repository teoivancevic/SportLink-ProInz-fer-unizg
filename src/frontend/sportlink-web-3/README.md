This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
---

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

1. Create a `.env.local` file in the root directory:
```
# .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5173
# NEXT_PUBLIC_API_URL=https://localhost:7045
NEXT_PUBLIC_API_URL=https://api-sportlink-test-03.azurewebsites.net
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY={get_from_project_lead}
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
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```


## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

<!-- ## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── services/      # API services
  │   └── api.ts     # API configuration
  ├── App.tsx        # Root component
  └── main.tsx       # Entry point
``` -->

## Development

1. The main page component is in `app/page.tsx`
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


