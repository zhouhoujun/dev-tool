import { Task, Operation, EnvOption, TaskOption, TaskConfig, ITaskDefine, DynamicLoaderOption } from '../../src/TaskConfig';
import tasks from './task';
import * as _ from 'lodash';
export * from './NodeTaskOption';

export default <ITaskDefine>{
    moduleTaskConfig(oper: Operation, option: TaskOption, env: EnvOption): TaskConfig {
        // register default asserts.
        option.asserts = _.extend({
            ts: { loader: tasks.tsDynamicTasks }
        }, option.asserts);

        // console.log('run moduleTaskConfig............');

        return <TaskConfig>{
            oper: oper,
            env: env,
            option: option
        }
    },

    moduleTaskLoader(config: TaskConfig): Promise<Task[]> {
        return Promise.resolve(config.dynamicTasks(tasks.nodeDynamicTasks));
    }
}
