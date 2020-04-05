import { AkairoModule, AkairoError, AkairoClient } from 'discord-akairo';
import { Model } from  'sequelize-typescript';
import { isEqual, omitBy, isUndefined } from 'lodash';
import Constants from 'constants';
import DatabaseService from 'services/database';

export default class MeetingDatabaseService extends DatabaseService {
}