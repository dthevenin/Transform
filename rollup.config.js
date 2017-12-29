const env = process.env.NODE_ENV

const config = {
  entry: 'src/Transform.js',
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
