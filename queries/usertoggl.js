const models = require('../models')
const User = require('./user').User;

exports.UserToggl = class {
    static create = async (userId, apiToken, channel) => {
        return await models.UserToggl.create({
            user_id: userId,
            token: apiToken,
            channel: channel,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    static findByUserId = async (userId) => {
        return await models.UserToggl.findOne({
            where: { user_id: userId }
        });
    }
};