# Slack bot for Toggl

<h2>!!!!! Worning !!!!!</h2>
<h2>本機能は動作可能な状態ですが、まだまだ現在開発途中です</h2>

## tl;dr
SlackのコマンドからTogglのトラッキング開始・停止を行うアプリです。

## 起動方法
git, docker, docker-composeが実行可能な環境を用意する。
1. 本レポジトリをアプリを設置する環境にcloneします。
1. .env.exampleを.envに複製します。
1. Slackでアプリを登録を行い、必要な権限とtokenを発行します。  
参考：[Bolt入門ガイド](https://slack.dev/bolt-js/ja-jp/tutorial/getting-started), [Socketモードの設定](https://api.slack.com/apis/connections/socket)
1. .envにSlackのtokenを設定します。
1. `docker-compose up -d`でアプリを起動します。

## コマンド
| コマンド | 説明 |
| ---- | ---- |
| help | コマンドの一覧、説明を表示します。 |
| start | トラッキングの開始モーダルを表示します。 |
| stop | トラッキングを停止します。 |

※ 初回実行時はTogglのAPIトークン登録モーダルが表示されます。
