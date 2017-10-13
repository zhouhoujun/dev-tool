import { ILoaderOption } from './ILoaderOption';
import { TaskSource } from 'development-core';
/**
 * loader to load tasks from directory.
 *
 * @export
 * @interface DirLoaderOption
 * @extends {ILoaderOption}
 */
export interface IDirLoaderOption extends ILoaderOption {
    /**
     * loader dir
     *
     * @type {TaskSource}
     * @memberOf ILoaderOption
     */
    dir?: TaskSource;
    /**
     * config in directory.
     *
     * @type {string}
     * @memberOf DirLoaderOption
     */
    dirConfigFile?: string;
}
