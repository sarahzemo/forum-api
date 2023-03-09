const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadsRespository = require('../../Domains/threads/ThreadsRespository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadsRepositoryPostgres extends ThreadsRespository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async saveThread(addThread) {
        const { title, body, owner } = addThread;
        const id = `thread-${this._idGenerator()}`;
        const create_at = new Date().toISOString()

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, create_at],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT id, title, owner FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
        return result.rows[0];
    }

    async getDetailThreadById(threadId) {
        const query = {
            text: 'SELECT t.id, t.title, t.body, u.username, t.create_at from threads t JOIN users u on t.owner = u.id WHERE t.id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
        return new DetailThread({... result.rows[0]});
    }
}

module.exports = ThreadsRepositoryPostgres;