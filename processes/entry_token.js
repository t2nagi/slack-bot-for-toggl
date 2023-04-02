const { ConsoleLogger } = require("@slack/logger");
const UserQuery = require('../queries/user').User;
const UserTogglQuery = require('../queries/usertoggl').UserToggl;
const TogglClient = require('../toggl/toggl_client');

const CALLBACK_ID = 'entry_token';
const FIELD_API_TOKEN = 'api_token';
const FIELD_CHANNEL = 'channel';

class EntryToken {
    constructor() {
    }

    execute = async (body, client) => {
        await client.views.open({
            // 適切な trigger_id を受け取ってから 3 秒以内に渡す
            trigger_id: body.trigger_id,
            // view の値をペイロードに含む
            view: {
                type: 'modal',
                callback_id: CALLBACK_ID,
                private_metadata: `${body.channel_id}`,
                title: {
                    type: "plain_text",
                    text: "TogglのAPI Token登録"
                },
                submit: {
                    type: "plain_text",
                    text: "Submit"
                },
                blocks: [
                    {
                        type: "header",
                        text: {
                            type: "plain_text",
                            text: "Togglコマンドの利用にはAPIトークンの登録が必要です。",
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "input",
                        block_id: FIELD_API_TOKEN,
                        element: {
                            type: "plain_text_input",
                            action_id: FIELD_API_TOKEN,
                            placeholder: {
                                type: "plain_text",
                                text: "API Token"
                            }
                        },
                        label: {
                            type: "plain_text",
                            text: "Toggl API Token"
                        },
                        hint: {
                            type: "plain_text",
                            text: "https://developers.track.toggl.com/docs/authentication ←で取得方法を確認"
                        }
                    },
                    {
                        type: "input",
                        block_id: FIELD_CHANNEL,
                        element: {
                            action_id: FIELD_CHANNEL,
                            type: "channels_select",
                            placeholder: {
                                type: "plain_text",
                                text: "チャンネル選択"
                            }
                        },
                        label: {
                            type: "plain_text",
                            text: "Togglを通知するチャンネル"
                        }
                    }
                ]
            }
        });
    }

    event = async (app) => {
        app.view(CALLBACK_ID, async ({ ack, body, view, client, logger }) => {
            await ack();

            console.log(body);

            try {
                let userId = body.user.id;
                let tokenValue = view.state.values[FIELD_API_TOKEN][FIELD_API_TOKEN];
                let cannelValue = view.state.values[FIELD_CHANNEL][FIELD_CHANNEL];
                let token = tokenValue.value;
                let cannel = cannelValue.selected_channel;

                let toggl = TogglClient(token);
                let c = await toggl.tracking.getTracking();


                let user = await UserQuery.selectInsert(userId);
                await UserTogglQuery.create(
                    user.id,
                    token,
                    cannel
                );
                await client.chat.postEphemeral({
                    channel: view.private_metadata,
                    user: userId,
                    text: `APIトークンの登録が完了しました。`
                });
            } catch (error) {
                console.error(error);

                await client.chat.postEphemeral({
                    channel: view.private_metadata,
                    user: body.user.id,
                    text: 'APIトークンの登録に失敗しました。トークンが正しいかご確認ください。'
                });
            }

        });
    }
}

module.exports = EntryToken