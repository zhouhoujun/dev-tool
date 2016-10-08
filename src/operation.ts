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
