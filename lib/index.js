/**
 * Created by Josue on 27/7/17.
 */
'use strict';

var inject = require('./inject'),
		vinylFS = require('vinyl-fs'),
		path = require('path');

function AssetsInjectWebpackPlugin(target, options) {
	this.options = options;
	if (target) {
		this.target = target;
	} else {
		throw new Error('Must provide target file in options');
	}
	if (!options.ouput) {
		this.options.ouput = this.target;
	}

}


AssetsInjectWebpackPlugin.prototype.apply = function (compiler) {
	var _self = this;
	compiler.plugin('done', onDone);


	function onDone(stats) {

		//get cwd
		var cwd = process.cwd();
		//get assets output folder
		var assetsPath = path.resolve(compiler.outputPath),
				assetsVinylOpts = {cwd: cwd, base: assetsPath};
		var targetFile = path.resolve(cwd, _self.target),
				targetPath = path.dirname(targetFile),
				targetVinylOpts = {cwd: cwd, base: targetPath};

		var injectablesPath = Object.keys(stats.compilation.assets).map(function (asset) {
			return path.resolve(assetsPath, asset);
		});

		console.log(injectablesPath);
		vinylFS.src(targetFile, targetVinylOpts)
			.pipe(inject(vinylFS.src(injectablesPath, assetsVinylOpts), _self.options))
			.pipe(vinylFS.dest(targetPath));
	}
};


module.exports = AssetsInjectWebpackPlugin;
