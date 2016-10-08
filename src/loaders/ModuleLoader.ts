import * as _ from 'lodash';
import { ITask } from '../ITask';
import { TaskConfig } from '../TaskConfig';
import { ITaskLoader }  from '../ITaskLoader';
import { Operation }  from '../Operation';

export class ModuleLoader implements ITaskLoader {

    constructor(private moduleName: string) {

    }

    load(oper: Operation): Promise<ITask[]> {

    }

    setup(config: TaskConfig, tasks: ITask[]): Promise<Array<string | string[] | Function>> {

    }
}
