require('date-utils');
const { ConsoleLogger } = require("@slack/logger");
const UserQuery = require('../queries/user').User;
const UserTogglQuery = require('../queries/usertoggl').UserToggl;

const TogglClient = require('../toggl/toggl_client');

const CALLBACK_ID = 'toggl_start';
const FIELD_WORKSPACE = 'workspace';
const FIELD_DESCRIPTION = 'description';

class TogglStop {
    constructor() {
    }

    execute = async (say, respond, userId, userToggl, body, client) => {
        // project取得
        let toggl = TogglClient(userToggl.token);
        let tracking = await toggl.tracking.getTracking();
        if (!tracking) {
            respond('トラッキングは終了しています。');
            return 0;
        }

        let result = await toggl.tracking.stop();

        let description = result.description;
        let duration = 86400000 + ((new Date()).getTimezoneOffset() * 60000) + (result.duration * 1000);
        let elapsedTime = new Date(duration);

        let message = description && description.length > 0 ?
            "```" + description + "```" : '';

        await client.chat.postMessage({
            channel: userToggl.channel,
            text: `<@${userId}> さんが作業を終了しました。(作業時間:${elapsedTime.toFormat('HH24:MI:SS')})\n${message}`
        });

        respond(`トラッキングを終了しました。(作業時間:${elapsedTime.toFormat('HH24:MI:SS')})\n${message}`);
    }
}

module.exports = TogglStop