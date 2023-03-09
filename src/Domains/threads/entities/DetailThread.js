class DetailThread {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.title = payload.title;
        this.body = payload.body;
        this.username = payload.username;
        this.date = payload.create_at;
    }

    _verifyPayload(payload) {
        const { id, title, body, username, create_at } = payload;
        if (!id || !title || !body || !username || !create_at) {
            throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string' 
        || typeof username !== 'string' || typeof id !== 'string' 
        || typeof create_at !== 'string') {
            throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailThread;