import { ITaskDefine } from 'development-core';
import { BaseLoader } from './BaseLoader';
import { IContext } from '../IContext';
/**
 * load task from module or npm package.
 *
 * @export
 * @class ModuleLoader
 * @extends {BaseLoader}
 */
export declare class ModuleLoader extends BaseLoader {
    constructor(ctx: IContext);
    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine>;
}
