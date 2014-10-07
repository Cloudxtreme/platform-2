# Getting Started

Cloudwalkers platform version using Backbone.js, Grunt, Bower & Requirejs


# Installation

1. Install [Node.js](http://nodejs.org/)
2. Run ```cd path/to/local/platform```
3. Run ```sudo npm install -g grunt-cli bower```
4. Run ```bower install``` to install vendor dependencies.
5. Run ```npm install``` to install the required dependencies.
6. Run ```cp src/js/config-default.js src/js/config.js``` to create your local config file.
7. Edit config file if required.


# Plugin instalation

This will install the necessary plugins in a newly created src/vendor folder.
All the plugin conflicts should be resolved persistently.

Run before first use:		bower install


# Cloudwalkers Gruntfile

The gruntfile takes care of JS sanity testing,
compression of javascript and css files, concatinating of template files
and the templating process of the html files.

Run for release: 			grunt release
Run for staging:			grunt staging
Change listener:			grunt watcher

Working directory: 			src
Distribution directory: 	dist
Required files: 			package.json (all grunt plugins are listed)
Interesting read: 			http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/


#######

# First use

Run 	# Instalation
Run 	# Plugins Instalation
Run		grunt staging --force	(The current version is till experimental and this will allow to go through all the warnings.)

#######

[Grunt]: http://gruntjs.com/
[Bower]: http://bower.io/
[npm]: https://www.npmjs.org/