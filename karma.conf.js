module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		frameworks: ['jasmine'],
		files: [
			'https://code.jquery.com/jquery-2.1.1.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/js/materialize.min.js',
			'dist/scripts/main.min.js',
			'test/scripts/init.spec.js'
		],
		plugins: [
			'karma-chrome-launcher',
			'karma-tap',
			'karma-sourcemap-loader',
			'karma-webpack',
			'karma-jasmine',
			'request'
			// *** This 'registers' the Karma webpack plugin.
		]
	});
};
