

class Tracking {

    constructor(client) {
        this.client = client;
    }


    /**
     * Run a new time entry
     * @link https://developers.track.toggl.com/docs/tracking#run-a-new-time-entry
     */
    async start(workspaceId, description = '') {
        const API_PATH = `workspaces/${workspaceId}/time_entries`;
        let apiUrl = this.client.createUrl(API_PATH);

        let startDate = new Date();
        var unixTimestamp = Math.floor(startDate.getTime() / 1000) * -1;

        return await this.client.httpPost(apiUrl, {
            description: description,
            tags: [],
            billable: false,
            workspace_id: Number(workspaceId),
            duration: unixTimestamp,
            start: startDate,
            stop: null
        });
    }

    /**
     * Is started
     * @link https://developers.track.toggl.com/docs/tracking#run-a-new-time-entry
     */
    async getTracking() {
        const API_PATH = `me/time_entries/current`;
        let apiUrl = this.client.createUrl(API_PATH);

        return await this.client.httpGet(apiUrl);
    }

    /**
     * Stop an existing time entry
     * @link https://developers.track.toggl.com/docs/tracking#stop-an-existing-time-entry
     */
    async stop() {
        let track = await this.getTracking();
        let workspaceId = track.workspace_id;
        let timeEntryId = track.id;

        const API_PATH = `workspaces/${workspaceId}/time_entries/${timeEntryId}/stop`;
        let apiUrl = this.client.createUrl(API_PATH);

        return await this.client.httpPatch(apiUrl);
    }
}

module.exports = Tracking;