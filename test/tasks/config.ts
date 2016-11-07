import { ITask, IEnvOption, bindingConfig, ITaskOption, ITaskConfig, taskdefine, ITaskDefine } from 'development-core';
import * as tasks from './task';
import * as _ from 'lodash';
export * from './NodeTaskOption';

@taskdefine()
export class TestTaskDefine implements ITaskDefine {
    loadConfig(option: ITaskOption, env: IEnvOption): ITaskConfig {
        // register default asserts.
        option.asserts = _.extend({
            ts: { loader: (config: ITaskConfig) => config.findTasks(tasks, { group: 'ts' }) }
        }, option.asserts);

        // console.log('run moduleTaskConfig............');

        return <ITaskConfig>{
            env: env,
            option: option
        };
    }

    loadTasks(config: ITaskConfig): Promise<ITask[]> {
        return config.findTasks(tasks);
    }
}

