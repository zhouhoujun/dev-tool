import { ITask, Operation, IEnvOption, ITaskOption, ITaskConfig, ITaskDefine, IDynamicLoaderOption } from 'development-core';
import { BaseLoader } from './BaseLoader';

export class DynamicLoader extends BaseLoader {

    constructor(option: ITaskOption) {
        super(option);
    }


    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = null;
        let loader: IDynamicLoaderOption = this.option.loader;
        if (loader.taskDefine) {
            tsdef = loader.taskDefine;
        } else {
            tsdef = dynamicTaskDefine(loader, this.getTaskModule())
        }

        return Promise.resolve(tsdef);
    }
}


let dynamicTaskDefine = (option: IDynamicLoaderOption, modules) => {
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
            if (modules) {
                return config.findTasks(modules)
                    .then(tasks => {
                        tasks = tasks || [];
                        return tasks.concat(config.generateTask(lderOption.dynamicTasks));
                    });
            } else {
                return Promise.resolve(config.generateTask(lderOption.dynamicTasks));
            }
        }
    }
}
