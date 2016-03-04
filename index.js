var bower = require('bower');
var notify = require('notify');
var path = require('path');
var fs = require('fs');
var util = require('./util');

var Bower = (function() {
	
	/**
	 * @constructor
	 */
	function Bower(config) {
		config = config || {};
		config.cwd = config.cwd || './';
		config.directory = config.directory || 'bower_components';
		this.installDir = getInstallDir(config);
		this.config = config;
	}
	
	var cls = Bower.prototype;
	
	function getInstallDir(config) {
		var installDir = null;
		
		var bowerrc = path.join(config.cwd, '.bowerrc');
		if (fs.existsSync(bowerrc)) {
			var bower_config = JSON.parse(fs.readFileSync(bowerrc));
			installDir = path.join(config.cwd, bower_config.directory);
		} else {
			installDir = path.join(config.cwd, config.directory);
		}
		
		return installDir || path.join(config.cwd, './bower_components');
	}

	/**
	 * @return {Boolean}
	 */
	cls.isInstalled = function() {
		return fs.existsSync(this.installDir);
	};
	
	cls.install = function() {
		if (this.isInstalled()) {
			return;
		}
		return bower({cwd: this.config.cwd, directory: this.config.directory})
			.pipe(notify({message: 'Bower installed.', onLast: true}));
	};
	
	cls.update = function() {
		return bower({cmd: 'update', cwd: this.config.cwd, directory: this.config.directory})
			.pipe(notify({message: 'Bower updated.', onLast: true}));
	};
	
	return Bower;
})();

function createTasks(instance) {
	var tasks = {};
	for (var name in instance) {
		if (typeof(instance[name]) === 'function') {
			tasks[name] = instance[name].bind(instance);
		}
	}
	return tasks;
}

module.exports = {
	create: function(config) {
		return createTasks(new Bower(config));
	}
};
