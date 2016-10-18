import * as _ from 'lodash';
import { Task, Operation, TaskOption, TaskConfig } from '../TaskConfig';
import { ITaskLoader }  from '../ITaskLoader';

export class ModuleLoader implements ITaskLoader {

    constructor(private moduleName: string) {

    }

    load(oper: Operation): Promise<Task[]> {
        return null;
    }

    loadConfg(oper: Operation, option: TaskOption): Promise<TaskConfig> {
        return null;
    }
}
