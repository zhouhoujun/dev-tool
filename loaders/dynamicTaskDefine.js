"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (modules) {
    return {
        loadConfig: function loadConfig(option, env) {
            return {
                env: env,
                option: option
            };
        },
        loadTasks: function loadTasks(config) {
            var lderOption = config.option.loader;
            var dtask = [];
            if (lderOption.dynamicTasks) {
                dtask = config.generateTask(lderOption.dynamicTasks);
            }
            if (modules) {
                console.log(modules);
                return config.findTasks(modules).then(function (tasks) {
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
//# sourceMappingURL=../sourcemaps/loaders/dynamicTaskDefine.js.map
