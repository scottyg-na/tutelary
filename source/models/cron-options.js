export default class CronOptions {

    name: String = '';
    time: String = '';
    runOnInit: Boolean = true;

    constructor(options) {
        Object.assign(this, options);
    }
}