require('dotenv').config();
const esbuild = require('esbuild');
const isProduction = process.env.NODE_ENV === 'production';

esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: !isProduction,
  minify: isProduction,
  define: {
    // Make the API key available in the code as process.env.API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  jsx: 'automatic', // Use the new JSX transform
}).catch(() => process.exit(1));
