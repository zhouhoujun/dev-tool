"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * create dynamic task define.
 */
exports.default = function (modules) {
    return {
        tasks: function (context) {
            var lderOption = context.option.loader;
            var dtask = [];
            if (lderOption.dynamicTasks) {
                dtask = context.generateTask(lderOption.dynamicTasks);
            }
            if (modules) {
                // console.log(modules);
                return context.findTasks(modules)
                    .then(function (tasks) {
                    tasks = tasks || [];
                    if (dtask) {
                        tasks = tasks.concat(dtask);
                    }
                    return tasks;
                });
            }
            else if (dtask) {
                return Promise.resolve(dtask);
            }
            else {
                return Promise.reject('can not find tasks!');
            }
        }
    };
};

//# sourceMappingURL=../sourcemaps/utils/taskDefine.js.map
