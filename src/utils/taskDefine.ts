import { ITask, ITaskContext, ITaskDefine, } from 'development-core';
import { IDynamicLoaderOption, IAssertOption } from '../TaskOption';

export default (modules) => {
    return <ITaskDefine>{
        tasks(context: ITaskContext): Promise<ITask[]> {
            let lderOption: IDynamicLoaderOption = (<IAssertOption>context.option).loader;
            let dtask: ITask[] = [];
            if (lderOption.dynamicTasks) {
                dtask = context.generateTask(lderOption.dynamicTasks);
            }
            if (modules) {
                // console.log(modules);
                return context.findTasks(modules)
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
