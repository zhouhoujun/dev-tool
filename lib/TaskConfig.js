"use strict";
(function (Operation) {
    Operation[Operation["build"] = 0] = "build";
    Operation[Operation["test"] = 1] = "test";
    Operation[Operation["e2e"] = 2] = "e2e";
    Operation[Operation["release"] = 3] = "release";
    Operation[Operation["deploy"] = 4] = "deploy";
})(exports.Operation || (exports.Operation = {}));
var Operation = exports.Operation;

//# sourceMappingURL=sourcemaps/TaskConfig.js.map
