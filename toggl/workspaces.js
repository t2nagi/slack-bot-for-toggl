

class Workspaces {

    constructor(client) {
        this.client = client;
    }


    /**
     * User workspaces
     * @link https://developers.track.toggl.com/docs/workspace#user-workspaces
     */
    async list() {
        const API_PATH = 'me/workspaces';
        let apiUrl = this.client.createUrl(API_PATH);

        return await this.client.httpGet(apiUrl);
    }
}

module.exports = Workspaces;