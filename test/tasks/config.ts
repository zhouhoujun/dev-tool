import { ITask, bindingConfig, IContextDefine, ITaskContext, ITaskConfig, taskdefine } from 'development-core';
import * as tasks from './task';
import * as _ from 'lodash';
export * from './NodeTaskOption';


@taskdefine
export class ContextDefine implements IContextDefine {
    getContext(config: ITaskConfig): ITaskContext {
        // register default asserts.

        config.option.asserts = _.extend({
            ts: { loader: (ctx: ITaskContext) => ctx.findTasks(tasks, { group: 'ts' }) }
        }, config.option.asserts);

        return bindingConfig(config);
    }

    tasks(ctx: ITaskContext): Promise<ITask[]> {
        return ctx.findTasks(tasks);
    }
}

// @taskdefine()
// export class TestTaskDefine implements ITaskDefine {
//     loadConfig(option: ITaskOption, env: IEnvOption): ITaskConfig {
//         // register default asserts.
//         option.asserts = _.extend({
//             ts: { loader: (ctx: ITaskContext) => ctx.findTasks(tasks, { group: 'ts' }) }
//         }, option.asserts);

//         // console.log('run moduleTaskConfig............');

//         return <ITaskConfig>{
//             env: env,
//             option: option
//         };
//     }

//     loadTasks(ctx: ITaskContext): Promise<ITask[]> {
//         return ctx.findTasks(tasks);
//     }
// }

