require('dotenv').config();
const esbuild = require('esbuild');

const isProduction = process.env.NODE_ENV === 'production';

esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: !isProduction,
  minify: isProduction,
  define: {
    // Make environment variables available in the browser code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.FORMSPREE_FORM_ID': JSON.stringify(process.env.FORMSPREE_FORM_ID || ''),
  },
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  jsx: 'automatic',
}).catch(() => process.exit(1));
