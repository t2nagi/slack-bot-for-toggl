const got = require('got');
const Workspaces = require('./workspaces');
const Tracking = require('./tracking');

const TOGGL_API_BASE_URL = 'api.track.toggl.com/api/v9';

class TogglClient {

    constructor(token) {
        this.token = token;

        this.workspaces = new Workspaces(this);
        this.tracking = new Tracking(this);
    }

    createUrl = (path) => {
        return `https://${this.token}:api_token@${TOGGL_API_BASE_URL}/${path}`;
    }

    async httpGet(url) {
        try {
            return await got.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).json();
        } catch (error) {
            throw error;
        }
    }

    async httpPost(url, body = {}) {
        body.created_with = "Slack bot for tollg";

        try {
            return await got.post(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                json: body
            }).json();
        } catch (error) {
            throw error;
        }
    }

    async httpPatch(url) {
        try {
            return await got.patch(url).json();
        } catch (error) {
            throw error;
        }
    }
}


module.exports = (token) => {
    return new TogglClient(token);
}