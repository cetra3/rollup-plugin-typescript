var typescript = require( './index.js' );

export default {
  entry: 'src/index.ts',
  dest: 'dist/index.js',
	sourceMap: true,

  format: 'cjs',

  plugins: [
    typescript()
  ]
}
