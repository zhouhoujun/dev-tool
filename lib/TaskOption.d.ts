import { IAssertOption } from 'development-core';
import { ISubTaskOption } from './ISubTaskOption';
import { ITaskLoaderOption } from './ITaskLoaderOption';
import { RefProjects } from './RefProjects';
/**
 * task option setting.
 *
 * @export
 * @interface ITaskOption
 * @extends {IAssertOption}
 * @extends {ISubTaskOption}
 */
export interface ITaskOption extends IAssertOption, ISubTaskOption, ITaskLoaderOption, RefProjects {
}
