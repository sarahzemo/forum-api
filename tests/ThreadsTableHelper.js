const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableHelper = {
    async saveThread({
        id = 'thread-123',
        title = 'Judul Thread',
        body = 'Hai, ini adalah sebuah thread',
        owner = 'user-1111',
        date = '2023-02-27T07:26:14.499Z'
    }) {
        const query = {
            text: 'INSERT INTO threads values($1, $2, $3, $4, $5)',
            values: [id, title, body, owner, date]
        };
        await pool.query(query);
    },

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT id, title, owner FROM threads WHERE id = $1',
            values: [threadId],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
}

module.exports = ThreadsTableHelper;