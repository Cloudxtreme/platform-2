/**
 *	Cloudwalkers Gruntfile
 *	
 *	The gruntfile takes care of JS sanity testing,
 *	compression of javascript and css files, concatinating of template files
 *	and the templating process of the html files.
 *
 *	Run before first use: 		grunt install
 *	Run for release: 			grunt release
 *	Run for staging:			grunt staging
 *	Change listener:			grunt watcher
 *	
 *	Working directory: 			src
 *	Distribution direactory: 	dist
 *	Required files: 			package.json (all grunt plugins are listed)
 *	Interesting read: 			http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/
**/

/*global module:false*/
module.exports = function (grunt)
{
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),
		
		defaults: {
			source: { dir: 'src' },
			staging: { dir: 'staging' },
			release: { dir: 'dist' }
		},
		
		/* Testing */
		jshint: {
			options: {
				asi: true, eqnull: true, jquery: true
			},
			source: ['<%= defaults.source.dir %>/js/**/*.js', '*.js', '!<%= defaults.source.dir %>/js/*-default.js']
		},
		
		/* Cleaning */
		clean: {
			staging: ['<%= defaults.staging.dir %>'],
			release: ['<%= defaults.release.dir %>']
		},
		
		/* Build files */
		mustache_render: {
			staging: {
				files:
				[{
					expand: true,
					cwd: '<%= defaults.source.dir %>/',
					src: '*.html',
					dest: '<%= defaults.staging.dir %>/',
					data: {
						title: '<%= pkg.title %>',
						description: '<%= pkg.description %>',
						version: '<%= pkg.version %>',
						files: {
							stylesheets: grunt.file.expand({cwd: 'src'}, 'css/**/*.css').map(function(path){ return {src: '/' + path}; }),
							scripts: grunt.file.expand({cwd: 'src'}, 'js/**/*.js').map(function(path){ return {src: '/' + path}; }),
							templates: '/js/templates.js'
						}
					}
				}]
			},
			release: {
				files:
				[{
					expand: true,
					cwd: '<%= defaults.source.dir %>/',
					src: '*.html',
					dest: '<%= defaults.release.dir %>/',
					data: {
						title: '<%= pkg.title %>',
						description: '<%= pkg.description %>',
						version: '<%= pkg.version %>',
						files: {
							stylesheets: [{src: '/css/styles-<%= pkg.version %>.min.css'}],
							scripts: [{src: '/js/cloudwalkers-<%= pkg.version %>.min.js'}],
							templates: '/js/templates-<%= pkg.version %>.js'
						}
					}
				}]
			}
		},
		
		/* Compress files */
		cssmin: {
			combine: {
				files: {
					'<%= defaults.release.dir %>/css/styles-<%= pkg.version %>.min.css': [
						'<%= defaults.source.dir %>/css/**/*.css',
						'!*.combine.css',
						'!*.min.css'
					]
				}
			}
		},
		
		uglify: {
			release: {
				files: {
					'<%= defaults.release.dir %>/js/cloudwalkers-<%= pkg.version %>.min.js': [
						'<%= defaults.source.dir %>/js/**/*.js',
						'!*.min.js'
					]
				}
			}
		},
		
		/* Copy and concatinate files */
		copy: {
			watcher: {
				files: [
					{expand: true, cwd: '<%= defaults.source.dir %>', src: ['/*.html', '*.js','css/**/*.css','js/**/*.js'], dest: '<%= defaults.staging.dir %>/', filter: 'isFile'}
				]
			},
			staging: {
				files: [
					{expand: true, cwd: '<%= defaults.source.dir %>', src: ['*.json', '*.txt', '*.ico', '*.php', 'images/**','fonts/**','css/**','js/**','!js/**-default.js','storage/**'], dest: '<%= defaults.staging.dir %>/', filter: 'isFile'},
					{expand: true, cwd: '<%= defaults.source.dir %>/vendor', src: ['*/*.js','*/*.css','*/dist/**','*/lib/**',"!**/Gruntfile.js"], dest: '<%= defaults.staging.dir %>/js/lib'}
				]
			},
			release: {
				files: [
					{expand: true, cwd: '<%= defaults.source.dir %>', src: ['*.txt', '*.ico', '*.php', 'images/**','fonts/**','storage/**'], dest: '<%= defaults.release.dir %>/', filter: 'isFile'},
					{expand: true, cwd: '<%= defaults.source.dir %>/vendor', src: ['*/*.js','*/*.css','*/dist/**','*/lib/**',"!**/Gruntfile.js"], dest: '<%= defaults.release.dir %>/js/lib'}
				]
			}
		},
		
		mustache: {
			staging : {
				src: '<%= defaults.source.dir %>/templates/',
				dest: '<%= defaults.staging.dir %>/js/templates.js',
				options: {
					prefix: 'Templates = ',
					postfix: ';'
				}
			},
			release : {
				src: '<%= defaults.source.dir %>/templates/',
				dest: '<%= defaults.release.dir %>/js/templates-<%= pkg.version %>.js',
				options: {
					prefix: 'Templates = ',
					postfix: ';'
				}
			}
		},
		
		/* Balance processes */
		concurrent: {
			staging: ['mustache_render:staging', 'copy:staging', 'mustache:staging'],
			release: ['mustache_render:release', 'cssmin', 'copy:release', 'uglify', 'mustache:release'],
			/*watch: ['newer:mustache_render:staging', 'newer:copy:staging', 'newer:mustache:staging'],*/
			watch: ['newer:mustache_render:staging', 'newer:copy:staging', 'mustache:staging'],
			test: ['jshint:source']
		},
		
		/* Watch the beast */
		watch: {
			options: {cwd: '<%= defaults.source.dir %>'},
			files: ['*.html', '*.js','css/**/*.css','js/**/*.js','templates/**/*.mustache'],
			tasks: ['concurrent:watch']
		}
	});
	
	// Register tasks
	grunt.registerTask('staging', ['concurrent:test', 'clean:staging', 'concurrent:staging']);
	grunt.registerTask('release', ['concurrent:test', 'clean:release', 'concurrent:release']);
	grunt.registerTask('watcher', ['watch']);
	grunt.registerTask('default', ['release']);
};