/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/vinyl/vinyl.d.ts" />
/// <reference path="../typings/through/through.d.ts" />
/// <reference path="../typings/clone/clone.d.ts" />
var builder = require('./builder');
var through = require('through');
var clone = require('clone');
function create(config, onError) {
    if (onError === void 0) { onError = function (err) { return console.log(err); }; }
    var _builder = builder.createTypeScriptBuilder(clone(config));
    function createStream() {
        return through(function (file) {
            // give the file to the compiler
            if (file.isStream()) {
                this.emit('error', 'no support for streams');
                return;
            }
            _builder.file(file);
        }, function () {
            var _this = this;
            // start the compilation process
            _builder.build(function (file) { return _this.queue(file); }, onError);
            this.queue(null);
        });
    }
    return function () { return createStream(); };
}
exports.create = create;
