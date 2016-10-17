import { Operation } from './operation';

export interface EnvOption {
    /**
     * jspm project root.
     * 
     * @type {string}
     * @memberOf EnvOption
     */
    path?: string;
    /**
     * help doc
     * 
     * @type {(boolean | string)}
     * @memberOf EnvOption
     */
    help?: boolean | string;
    test?: boolean | string;
    serve?: boolean | string;
    e2e?: boolean | string;
    release?: boolean;
    deploy?: boolean;
    watch?: boolean | string;
    /**
     * run spruce task.
     */
    task?: string;

    /**
     * project config setting.
     * 
     * @type {string}
     * @memberOf EnvOption
     */
    config?: string;

    key?: number;
    value?: number;
    csv?: string;
    dist?: string;
    lang?: string;

    publish?: boolean | string;

    grp?: string | string[];
}

export interface LoaderOption {
    type: string;
    dir?: string[];
    module?: string;
}

export interface TaskConfig {
    env?: EnvOption;
    /**
     * task loader
     * 
     * @type {string}
     * @memberOf TaskConfig
     */
    loader: LoaderOption;
    /**
     * the project src root folder. default 'src'.
     */
    src: string;
    /**
     * build folder. default 'dist'.
     */
    dist: string;
    /**
     * external task for 
     * 
     * @memberOf TaskConfig
     */
    externalTask?: ((oper: Operation) => string | string[] | void);
    /**
     * run tasks sequence.
     * 
     * 
     * @memberOf TaskConfig
     */
    runTasks?: Array<string | string[]> | ((tasks: Array<string | string[]>) => Array<string | string[]>);
}

