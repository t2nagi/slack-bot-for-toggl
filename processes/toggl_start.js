const { ConsoleLogger } = require("@slack/logger");
const UserQuery = require('../queries/user').User;
const UserTogglQuery = require('../queries/usertoggl').UserToggl;

const TogglClient = require('../toggl/toggl_client');

const CALLBACK_ID = 'toggl_start';
const FIELD_WORKSPACE = 'workspace';
const FIELD_DESCRIPTION = 'description';

class TogglStart {
    constructor() {
    }

    execute = async (say, respond, userToggl, body, client) => {
        // project取得
        let toggl = TogglClient(userToggl.token);
        let tracking = await toggl.tracking.getTracking();
        if (tracking) {
            respond('すでにトラッキング中です。');
            return 0;
        }


        var options = [];
        let workspaces = await toggl.workspaces.list();
        workspaces.forEach(workspace => {
            options.push(
                {
                    text: {
                        type: "plain_text",
                        text: workspace.name
                    },
                    value: String(workspace.id)
                });
        });

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
                    text: "トラッキング開始"
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
                            text: "開始するトラッキングの情報を登録してください",
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "input",
                        block_id: FIELD_WORKSPACE,
                        label: {
                            type: "plain_text",
                            text: "トラッキングを記録するワークスペースを選択"
                        },
                        element: {
                            type: "static_select",
                            action_id: FIELD_WORKSPACE,
                            placeholder: {
                                type: "plain_text",
                                text: "ワークスペースを選択",
                                emoji: true
                            },
                            options: options,

                        }
                    },
                    {
                        type: "input",
                        block_id: FIELD_DESCRIPTION,
                        label: {
                            type: "plain_text",
                            text: "作業内容",
                            emoji: true
                        },
                        element: {
                            type: "plain_text_input",
                            action_id: FIELD_DESCRIPTION,
                            placeholder: {
                                type: "plain_text",
                                text: "(省略可)"
                            }
                        },
                        optional: true
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
                let workspaceId = view.state.values[FIELD_WORKSPACE][FIELD_WORKSPACE].selected_option.value;
                let description = view.state.values[FIELD_DESCRIPTION][FIELD_DESCRIPTION].value;

                let user = await UserQuery.findBySlackUserId(userId);
                let userToggl = await UserTogglQuery.findByUserId(user.id);

                let toggl = TogglClient(userToggl.token);
                toggl.tracking.start(
                    workspaceId,
                    description
                );

                let descriptionMsg = description && description.length > 0 ?
                    "```" + description + "```" : '';

                await client.chat.postMessage({
                    channel: userToggl.channel,
                    text: `<@${userId}> さんが作業を開始しました。\n${descriptionMsg}`
                });

                await client.chat.postEphemeral({
                    channel: view.private_metadata,
                    user: userId,
                    text: `トラッキングを開始しました。\n${descriptionMsg}`
                });

            } catch (error) {
                console.error(error);
            }

        });
    }
}

module.exports = TogglStart