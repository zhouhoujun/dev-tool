import * as _ from 'lodash';
import { Task, Operation, TaskOption, TaskConfig } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';

export class ModuleLoader extends BaseLoader {

    constructor(option: TaskOption) {
        super(option);
    }
}
