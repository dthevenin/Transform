export default {
  input: 'src/Transform.js',
  external: ['vs_utils'],
  output: [
    {
      file: './dist/vs_transform.js',
      name: 'vs_transform',
      globals: {},
      format: 'iife',
    },
    {
      file: './es/vs_transform.js',
      name: 'vs_transform',
      globals: {},
      format: 'es',
    },
    {
      file: './lib/vs_transform.js',
      name: 'vs_transform',
      globals: {},
      format: 'amd'
    }
  ],
  plugins: [
  ]
};
