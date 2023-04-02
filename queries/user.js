const { User } = require('../models')

exports.User = class {
    static findBySlackUserId = async (slackUserId) => {
        return await User.findOne({
            where: { slack_user_id: slackUserId }
        });
    }

    static create = async (slackUserId) => {
        return await User.create({
            slack_user_id: slackUserId,
            caretedAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static selectInsert = async (slackUserId) => {
        var user = await this.findBySlackUserId(slackUserId);

        if (!user) {
            user = await this.create(slackUserId);
        }

        return user;
    }
};