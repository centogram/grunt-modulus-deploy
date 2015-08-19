/*
 * grunt-modulus-deploy
 * https://github.com/digitaljohn/grunt-modulus-deploy
 *
 * Copyright (c) 2014 DigitalJohn
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;
var path = require('path');

var isWin = /^win/.test(process.platform);
var modulusPath = isWin ? 'modulus' : path.relative(process.cwd(), path.join(__dirname, '../', 'node_modules', 'modulus', 'bin', 'modulus'));

var execOptions = {};

var runCmd = function(cmd, okString, cb) {
    var cp = exec(cmd, execOptions, function(err, stdout, stderr) {
        if(err) {
            console.log(err);
            cb(err);
        } else {
            if(stdout.indexOf(okString) != -1){
                cb();
            }else{
                cb(true);
            }
        }
    });

    captureOutput(cp.stdout, process.stdout);
    captureOutput(cp.stderr, process.stderr);
};

var captureOutput = function(child, output) {
    child.pipe(output);
};

module.exports = function(grunt) {

    grunt.registerMultiTask('modulusDeploy', 'Allows deployment to modulus.io from Grunt.', function() {
        var options = this.options();

        var done = this.async();
        if ( options.path && options.path.length > 0 ) {
            options.path = ' ' + options.path;
        } else {
            options.path = '';
        }
        
        var deployCmd = modulusPath + ' deploy' + ' -p ' + options.project + options.path;

        runCmd(deployCmd, options.project+' running at', function(err){
            if(err){
                done(false);
            }else{
                done(true);
            }
        });

    });

};
