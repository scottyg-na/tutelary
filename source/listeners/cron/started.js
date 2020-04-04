import { Listener } from 'discord-akairo';
import Constants from 'constants';

export default class CronStartedListener extends Listener {
    constructor() {
        super(Constants.Events.CRON_STARTED, {
            emitter: 'cron',
            event: Constants.Events.CRON_STARTED
        });
    }

    exec(name, id) {
        this.client.logger.info(`[CRON] Action: Started, Id: ${id}, Name: ${name}`);
    }
}