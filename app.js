const { App } = require('@slack/bolt');
const EntryToken = require('./processes/entry_token');
const TogglStart = require('./processes/toggl_start');
const TogglStop = require('./processes/toggl_stop');

const UserQuery = require('./queries/user').User;
const UserTogglQuery = require('./queries/usertoggl').UserToggl;


const OPTION_HELP = 'help';
const OPTION_START = 'start';
const OPTION_STOP = 'stop';
const OPTION_SHOW = 'show';
const OPTION_INIT = 'init';

const app = new App({
    token: process.env.BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app started');
})();

const entryToken = new EntryToken();
const togglStart = new TogglStart();
const togglStop = new TogglStop();

entryToken.event(app);
togglStart.event(app);

app.command('/toggl', async ({ ack, say, respond, body, client, logger }) => {
    // コマンドのリクエストを確認
    await ack();

    console.log(body);

    let userId = body.user_id;
    var option = body.text.split(' ')[0];
    let user = await UserQuery.findBySlackUserId(userId);
    let userToggl = user ? await UserTogglQuery.findByUserId(user.id) : null

    option = option.length > 0 ? option : OPTION_HELP;

    if (!userToggl && option != OPTION_HELP) {
        option = OPTION_INIT;
    }

    try {
        switch (option) {
            case OPTION_INIT:
                await entryToken.execute(body, client);
                break;
            case OPTION_START:
                await togglStart.execute(say, respond, userToggl, body, client);
                break;
            case OPTION_STOP:
                await togglStop.execute(say, respond, userId, userToggl, body, client);
                break;
            case OPTION_HELP:
            default:
                let commands = `/toggl start => 開始モーダル表示
/toggl stop  => 停止モーダル表示
/toggl help  => ヘルプ表示`;
                await respond("toggl コマンド ヘルプ\n```" + commands + "```");
        }
    } catch (error) {
        console.error(error);
        respond('サーバエラーが発生しました。エラーログを確認してください。');
    }

}); 