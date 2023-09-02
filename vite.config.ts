// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
import * as path from 'path';

// import path from 'path';
// import nodePolyfills from 'rollup-plugin-polyfill-node';
// // import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';

// export default defineConfig(({ command, mode }) => {
//   return {
//     optimizeDeps: {
//       disabled: false,
//       // esbuildOptions: {
//       //   // Enable esbuild polyfill plugins
//       //   plugins: [nodeModulesPolyfillPlugin()],
//       // },
//     },
//     resolve: {
//       alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
//     },
//     plugins: [react(), nodePolyfills()],
//     define: {
//       // process: {},
//       // global: {},
//       __VALUE__: `"${process.env.VALUE}"`,
//     },

//     // build: {
//     //   commonjsOptions: {
//     //     include: [],
//     //   },
//     // },
//   };
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  server: {
    port: 3000,
  },
});
