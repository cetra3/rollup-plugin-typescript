var assert = require( 'assert' );
var rollup = require( 'rollup' );
var typescript = require( '../dist/index.js' );

process.chdir( __dirname );

describe( 'rollup-plugin-typescript', function () {
	this.timeout( 5000 );

	it( 'runs code through typescript', function () {
		var start = Date.now();

		return rollup.rollup({
			entry: 'sample/basic/main.ts',
			plugins: [
				typescript()
			]
		}).then( function ( bundle ) {
			console.log( 'bundled in %s ms', Date.now() - start );

			start = Date.now();
			const generated = bundle.generate();
			console.log( 'generated in %s ms', Date.now() - start );

			const code = generated.code;

			// We should generate code without `const` and `: number`.
			assert.ok( code.indexOf( 'number' ) === -1, code );
			assert.ok( code.indexOf( 'const' ) === -1, code );
		});
	});

	it( 'transpiles ES6 features to ES5', function () {
		var start = Date.now();

		return rollup.rollup({
			entry: 'sample/import-class/main.ts',
			plugins: [
				typescript()
			]
		}).then( function ( bundle ) {
			console.log( 'bundled in %s ms', Date.now() - start );

			start = Date.now();
			const generated = bundle.generate();
			console.log( 'generated in %s ms', Date.now() - start );

			const code = generated.code;

			assert.ok( code.indexOf( 'class' ) === -1, code );
			assert.ok( code.indexOf( '...' ) === -1, code );
			assert.ok( code.indexOf( '=>' ) === -1, code );
		});
	});
});
