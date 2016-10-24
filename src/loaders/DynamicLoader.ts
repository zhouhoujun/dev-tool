import { Src, Task, Operation, EnvOption, TaskOption, TaskConfig, ITaskDefine, DynamicLoaderOption } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';

export class DynamicLoader extends BaseLoader {

    constructor(option: TaskOption) {
        super(option);
    }


    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = null;
        let loader: DynamicLoaderOption = this.option.loader;
        if (loader.taskDefine) {
            tsdef = loader.taskDefine;
        } else {
            tsdef = dynamicTaskDefine(loader, this.getTaskModule())
        }

        return Promise.resolve(tsdef);
    }
}


let dynamicTaskDefine = (option: DynamicLoaderOption, modules) => {
    return <ITaskDefine>{
        moduleTaskConfig(oper: Operation, option: TaskOption, env: EnvOption): TaskConfig {
            // let lderOption: DynamicLoaderOption = option.loader;
            return {
                oper: oper,
                env: env,
                option: option,
                runTasks(subGroupTask?: Src, tasks?: Src[]): Src[] {
                    tasks = tasks || [];
                    if (subGroupTask) {
                        tasks.splice(0, 0, subGroupTask);
                    }
                    return tasks;
                }
            }
        },

        moduleTaskLoader(config: TaskConfig): Promise<Task[]> {
            let lderOption: DynamicLoaderOption = config.option.loader;
            if (modules) {
                return config.findTasksInModule(modules)
                    .then(tasks => {
                        tasks = tasks.concat(config.dynamicTasks(lderOption.dynamicTasks));
                    });
            } else {
                return Promise.resolve(config.dynamicTasks(lderOption.dynamicTasks));
            }
        }
    }
}
