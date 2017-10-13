import { IPipeOption, ICustomPipe, ITaskDefine } from 'development-core';
/**
 * task loader option.
 *
 * @export
 * @interface ILoaderOption
 * @extends {IPipeOption}
 */
export interface ILoaderOption extends IPipeOption, ICustomPipe {
    /**
     * loader type, default module.
     *
     * @type {string}
     * @memberOf ILoaderOption
     */
    type?: string;
    /**
     * module name or url
     *
     * @type {string | Object}
     * @memberOf ILoaderOption
     */
    module?: string | Object;
    /**
     * config module name or url.
     *
     * @type {string | Object}
     * @memberOf ILoaderOption
     */
    configModule?: string | Object;
    /**
     * config module name or url.
     *
     * @type {string | Object}
     * @memberOf ILoaderOption
     */
    taskModule?: string | Object;
    /**
     * custom task define
     *
     * @memberOf ILoaderOption
     */
    taskDefine?: ITaskDefine;
}
