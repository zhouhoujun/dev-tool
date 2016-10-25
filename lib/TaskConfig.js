"use strict";
(function (Operation) {
    Operation[Operation["build"] = 1] = "build";
    Operation[Operation["test"] = 2] = "test";
    Operation[Operation["e2e"] = 4] = "e2e";
    Operation[Operation["release"] = 8] = "release";
    Operation[Operation["deploy"] = 16] = "deploy";
})(exports.Operation || (exports.Operation = {}));
var Operation = exports.Operation;

//# sourceMappingURL=sourcemaps/TaskConfig.js.map
