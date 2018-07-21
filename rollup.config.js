export default {
  input: 'src/Transform.js',
  external: ['vs_utils'],
  output: [
    {
      file: './dist/vs_transform.js',
      name: 'vs_transform',
      globals: { vs_utils: 'vs_utils' },
      format: 'iife',
    },
    {
      file: './es/vs_transform.js',
      name: 'vs_transform',
      globals: { vs_utils: 'vs_utils' },
      format: 'es',
    },
    {
      file: './lib/vs_transform.js',
      name: 'vs_transform',
      globals: { vs_utils: 'vs_utils' },
      format: 'amd'
    }
  ],
  plugins: [
  ]
};
