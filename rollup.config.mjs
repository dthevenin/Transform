import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: `src/transform/index.ts`,
    plugins: [esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      tsconfig: 'src/tsconfig.json'
    })],
    output: [
      {
        file: `dist/vs_transform.amd.js`,
        format: 'amd',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: `dist/vs_transform.es.js`,
        format: 'es',
        sourcemap: true,
        exports: 'named',
      },
    ]
  },
  {
    input: `build/transform/index.d.ts`,
    plugins: [dts()],
    output: {
      file: `dist/vs_transform.d.ts`,
      format: 'es',
    },
  }
];
