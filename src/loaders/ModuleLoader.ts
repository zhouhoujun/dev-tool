// import * as _ from 'lodash';
import { TaskOption } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';

/**
 * module loader.
 * 
 * @export
 * @class ModuleLoader
 * @extends {BaseLoader}
 */
export class ModuleLoader extends BaseLoader {

    constructor(option: TaskOption) {
        super(option);
    }
}
