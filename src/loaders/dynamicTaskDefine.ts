import { ITask, Operation, IEnvOption, ITaskOption, ITaskConfig, ITaskDefine, IDynamicLoaderOption } from 'development-core';

export default (modules) => {
    return <ITaskDefine>{
        loadConfig(oper: Operation, option: ITaskOption, env: IEnvOption): ITaskConfig {
            return {
                oper: oper,
                env: env,
                option: option
            }
        },

        loadTasks(config: ITaskConfig): Promise<ITask[]> {
            let lderOption: IDynamicLoaderOption = config.option.loader;
            let dtask: ITask[] = [];
            if (lderOption.dynamicTasks) {
                dtask = config.generateTask(lderOption.dynamicTasks);
            }
            if (modules) {
                console.log(modules);
                return config.findTasks(modules)
                    .then(tasks => {
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
    }
}
