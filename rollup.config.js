const env = process.env.NODE_ENV

const config = {
  entry: 'src/transform.js',
  external: ['vs_utils'],
  globals: {},
  format: 'amd',
  moduleName: 'VSTransform',
  plugins: [
  ]
}

if (env === 'production') {
}

export default config
