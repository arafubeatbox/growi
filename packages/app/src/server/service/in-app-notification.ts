import { Types } from 'mongoose';
import { subDays } from 'date-fns';
import Crowi from '../crowi';
import {
  InAppNotification, InAppNotificationDocument, STATUS_UNREAD, STATUS_UNOPENED,
} from '~/server/models/in-app-notification';
import { ActivityDocument } from '~/server/models/activity';

import loggerFactory from '~/utils/logger';
import { RoomPrefix, getRoomNameWithId } from '../util/socket-io-helpers';

const logger = loggerFactory('growi:service:inAppNotification');


export default class InAppNotificationService {

  crowi!: Crowi;

  socketIoService!: any;

  commentEvent!: any;


  constructor(crowi: Crowi) {
    this.crowi = crowi;
    this.socketIoService = crowi.socketIoService;

    this.getUnreadCountByUser = this.getUnreadCountByUser.bind(this);
  }


  emitSocketIo = async(targetUsers) => {
    if (this.socketIoService.isInitialized) {
      targetUsers.forEach(async(userId) => {
        const count = await this.getUnreadCountByUser(userId);
        await this.socketIoService.getDefaultSocket()
          .emit('notificationUpdated', { userId, count });
      });
    }
  }

  upsertByActivity = async function(
      users: Types.ObjectId[], activity: ActivityDocument, createdAt?: Date | null,
  ): Promise<void> {
    const {
      _id: activityId, targetModel, target, action,
    } = activity;
    const now = createdAt || Date.now();
    const lastWeek = subDays(now, 7);
    const operations = users.map((user) => {
      const filter = {
        user, target, action, createdAt: { $gt: lastWeek },
      };
      const parameters = {
        user,
        targetModel,
        target,
        action,
        status: STATUS_UNREAD,
        createdAt: now,
        $addToSet: { activities: activityId },
      };
      return {
        updateOne: {
          filter,
          update: parameters,
          upsert: true,
        },
      };
    });

    await InAppNotification.bulkWrite(operations);
    logger.info('InAppNotification bulkWrite has run');
    return;
  }

  getLatestNotificationsByUser = async(userId, limitNum, offset) => {

    try {
      const paginationResult = await InAppNotification.paginate(
        { user: userId },
        {
          sort: { createdAt: -1 },
          offset,
          limit: limitNum || 10,
          populate: [
            { path: 'user' },
            { path: 'target' },
            { path: 'activities', populate: { path: 'user' } },
          ],
        },
      );

      return paginationResult;
    }
    catch (err) {
      logger.error('Error', err);
      throw new Error(err);
    }
  }

  // inAppNotificationSchema.virtual('actionUsers').get(function(this: InAppNotificationDocument) {
  //   const Activity = getModelSafely('Activity') || require('../models/activity')(this.crowi);
  //   return Activity.getActionUsersFromActivities((this.activities as any) as ActivityDocument[]);
  // });

  read = async function(user: Types.ObjectId): Promise<void> {
    const query = { user, status: STATUS_UNREAD };
    const parameters = { status: STATUS_UNOPENED };
    await InAppNotification.updateMany(query, parameters);

    return;
  };

  getUnreadCountByUser = async function(user: Types.ObjectId): Promise<number| undefined> {
    const query = { user, status: STATUS_UNREAD };

    try {
      const count = await InAppNotification.countDocuments(query);

      return count;
    }
    catch (err) {
      logger.error('Error on getUnreadCountByUser', err);
      throw err;
    }
  };


}

module.exports = InAppNotificationService;
