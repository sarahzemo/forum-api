const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123',
        content = 'Ga tau mau comment apa',
        thread = 'thread-111',
        owner = 'user-111',
        date = '2023-02-27T07:26:14.499Z',
        is_deleted = false
    }) {
        const query = {
            text: 'INSERT INTO comments values($1, $2, $3, $4, $5, $6)',
            values: [id, content, owner, thread, is_deleted, date]
        };
        await pool.query(query);
    },

    async getCommentById(threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [threadId],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
}

module.exports = CommentsTableTestHelper;