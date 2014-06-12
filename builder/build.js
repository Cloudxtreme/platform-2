var compressor = require('node-minify');
var fs = require ('fs');
var wrench = require('wrench');
var util = require ('util');

var CONFIG_SOURCEPATH = fs.realpathSync (__dirname + '/../');
var CONFIG_BUILDPATH = fs.realpathSync (__dirname + '/../build/');

console.log (CONFIG_BUILDPATH);

wrench.copyDirSyncRecursive(CONFIG_SOURCEPATH, CONFIG_BUILDPATH, {
	forceDelete: true, // Whether to overwrite existing directory or not
	excludeHiddenUnix: false, // Whether to copy hidden Unix files or not (preceding .)
	preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
	inflateSymlinks: true, // Whether to follow symlinks or not when copying files,
	exclude : /(build|\.git|builder)$/
});

if (fs.existsSync (CONFIG_BUILDPATH + '/public'))
{
	wrench.rmdirSyncRecursive (CONFIG_BUILDPATH + '/public');
}

if (fs.existsSync (CONFIG_BUILDPATH + '/.idea'))
{
	wrench.rmdirSyncRecursive (CONFIG_BUILDPATH + '/.idea');
}

if (fs.existsSync (CONFIG_BUILDPATH + '/php/config/db-local.php'))
{
	fs.unlinkSync (CONFIG_BUILDPATH + '/php/config/db-local.php');
}

if (fs.existsSync (CONFIG_BUILDPATH + '/php/config/social-local.php'))
{
	fs.unlinkSync (CONFIG_BUILDPATH + '/php/config/social-local.php');
}

// Compress all javascript files into one huge bulk
//var jsfiles = wrench.readdirSyncRecursive (CONFIG_BUILDPATH + '/js');

var buildfile = fs.readFileSync (CONFIG_BUILDPATH + '/templates/buildscripts.phpt', { 'encoding' : 'utf8' });

var paths = buildfile.match (/<script.*?src ?= ?"([^"]+)"/g);

var jsfilesout = [];

for (var i = 0; i < paths.length; i ++)
{
	var match = '<script type="text/javascript" src="';

	if (paths[i].substr (0, match.length) == match)
	{
		jsfilesout.push (CONFIG_BUILDPATH + '/' + paths[i].substr (match.length, paths[i].length - match.length - 1));
	}
}

//console.log (jsfilesout);

/*for (var i = 0; i < jsfiles.length; i ++)
 {
 var split = jsfiles[i].split ('.');
 if (split[split.length-1] == 'js')
 {
 jsfilesout.push (CONFIG_BUILDPATH + '/js/' + jsfiles[i]);
 }
 }
 */

// Compress into one huge js file
new compressor.minify({
	language: 'ECMASCRIPT5',
	type: 'gcc',
	fileIn: jsfilesout,
	fileOut: CONFIG_BUILDPATH + '/js/cloudwalkers.min.js',
	callback: function(err){

		if(err) {
			console.log(err);
		}

		// Now remove all those javascript files
		for (var i = 0; i < jsfilesout.length; i ++)
		{
			fs.unlinkSync (jsfilesout[i]);
		}

		// Replace the script tags
		fs.unlinkSync (CONFIG_BUILDPATH + '/templates/buildscripts.phpt');

		fs.writeFile(CONFIG_BUILDPATH + '/templates/buildscripts.phpt', '<script type="text/javascript" src="<?php echo BASE_URL; ?>js/cloudwalkers.min.js"></script>', function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("The file was saved!");

                console.log ("---");
                console.log ("Increasing version number");
                var versionfile = CONFIG_SOURCEPATH + '/php/config/version';
                var version = fs.readFileSync (versionfile, { 'encoding' : 'utf8' });
                console.log ("- Current version: " + version);
                version = version.split ('.');
                version[version.length - 1] = parseInt (version[version.length - 1]) + 1;
                version = version.join ('.');
                console.log ('- Next version: ' + version);
                fs.writeFileSync (versionfile, version);
			}
		});

	}
});