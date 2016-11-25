"use strict";

var development_core_1 = require('development-core');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (modules) {
    return {
        getContext: function getContext(config) {
            return development_core_1.bindingConfig(config);
        },
        tasks: function tasks(context) {
            var lderOption = context.option.loader;
            var dtask = [];
            if (lderOption.dynamicTasks) {
                dtask = context.generateTask(lderOption.dynamicTasks);
            }
            if (modules) {
                // console.log(modules);
                return context.findTasks(modules).then(function (tasks) {
                    tasks = tasks || [];
                    if (dtask) {
                        tasks = tasks.concat(dtask);
                    }
                    return tasks;
                });
            } else if (dtask) {
                return Promise.resolve(dtask);
            } else {
                return Promise.reject('can not find tasks!');
            }
        }
    };
};
//# sourceMappingURL=../sourcemaps/utils/contextDefine.js.map
