import chalk from 'chalk';
import { createLogger, format, transports } from 'winston';
import { inspect } from 'util';
import { DateTime } from 'luxon';
import RotateFile from 'winston-daily-rotate-file';

export default class Logger {

    logger: Any = createLogger({
        transports: [
            new transports.Console(),
            new RotateFile({
                filename: 'tutelary.%DATE%.log',
                dirname: process.cwd() + '/logs',
                maxFiles: '15d',
                maxSize: '256m'
            }),
        ],
        exitOnError: false,
        format: this.baseFormat()
    });

    baseFormat() {
        const formatMessage = log =>
            `${this.setColour('timestamp', this.time)}: [${this.setColour(log.level)}] ${log.message}`;
        const formatError = log =>
            `${this.setColour('timestamp', this.time)}: [${this.setColour(log.level)}] ${log.message}\n ${log.stack}\n`;
        const _format = log =>
            log instanceof Error
                ? formatError(log)
                : formatMessage(
                    typeof log.message === 'string'
                        ? log
                        : Object.create({ level: log.level, message: inspect(log.message, { showHidden: true, depth: 1 }) })
                );

        return format.combine(format.printf(_format));
    }

    setColour(type: string, content?: string) {
        type = type.toUpperCase();

        switch (type.toLowerCase()) {
            default: return chalk.cyan(type);
            case 'info': return chalk.greenBright(type);
            case 'debug': return chalk.magentaBright(type);ss
            case 'warn': return chalk.yellowBright(type);
            case 'error': return chalk.redBright(type);
            case 'timestamp': return chalk.bgMagenta.whiteBright(content);
        }
    }

    get time() {
        return DateTime.local().setZone(process.env.BOT_TIMEZONE).toFormat('dd/MM/yyyy, HH:mm:ss.S');
    }
}