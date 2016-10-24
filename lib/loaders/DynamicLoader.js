"use strict";
const BaseLoader_1 = require('./BaseLoader');
class DynamicLoader extends BaseLoader_1.BaseLoader {
    constructor(option) {
        super(option);
    }
    getTaskDefine() {
        let tsdef = null;
        let loader = this.option.loader;
        if (loader.taskDefine) {
            tsdef = loader.taskDefine;
        }
        else {
            tsdef = dynamicTaskDefine(loader, this.getTaskModule());
        }
        return Promise.resolve(tsdef);
    }
}
exports.DynamicLoader = DynamicLoader;
let dynamicTaskDefine = (option, modules) => {
    return {
        moduleTaskConfig(oper, option, env) {
            return {
                oper: oper,
                env: env,
                option: option,
                runTasks(subGroupTask, tasks) {
                    tasks = tasks || [];
                    if (subGroupTask) {
                        tasks.splice(0, 0, subGroupTask);
                    }
                    return tasks;
                }
            };
        },
        moduleTaskLoader(config) {
            let lderOption = config.option.loader;
            if (modules) {
                return config.findTasksInModule(modules)
                    .then(tasks => {
                    tasks = tasks.concat(config.dynamicTasks(lderOption.dynamicTasks));
                });
            }
            else {
                return Promise.resolve(config.dynamicTasks(lderOption.dynamicTasks));
            }
        }
    };
};

//# sourceMappingURL=../sourcemaps/loaders/DynamicLoader.js.map
