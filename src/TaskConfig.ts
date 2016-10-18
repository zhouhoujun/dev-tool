
/**
 * project development build operation.
 * 
 * @export
 * @enum {number}
 */
export enum Operation {
    /**
     * build compile project.
     */
    build,
    /**
     * test project.
     */
    test,
    /**
     * e2e test project.
     */
    e2e,
    /**
     * release project.
     */
    release,
    /**
     * release and deploy project.
     */
    deploy
}


export type Task = (config: TaskConfig, callback?: Function) => string | string[];

export type configBuilder = (oper: Operation) => TaskConfig;


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

/**
 * task loader option.
 * 
 * @export
 * @interface LoaderOption
 */
export interface LoaderOption {
    /**
     * loader type.
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    type: string;
    /**
     * loader dir
     * 
     * @type {string[]}
     * @memberOf LoaderOption
     */
    dir?: string[];
    /**
     * module
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    module?: string;
    /**
     * task config file name or task config builder.
     * 
     * 
     * @memberOf TaskOption
     */
    taskConfig?: string | (() => configBuilder);
    /**
     * task config file name
     * 
     * @type {string}
     * @memberOf TaskOption
     */
    taskConfigFileName?: string;
}

/**
 * task option setting.
 * 
 * @export
 * @interface TaskOption
 */
export interface TaskOption {
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



export interface TaskConfig {
    env: EnvOption;
    option: TaskOption;
}

