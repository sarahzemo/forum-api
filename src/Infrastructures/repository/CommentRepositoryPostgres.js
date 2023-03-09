const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(addThread) {
        const { content, threadId, owner } = addThread;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, owner, threadId],
        };

        const result = await this._pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async verifyCommentOwner(commentId, owner) {
        const query = {
            text: 'SELECT owner FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Komentar tidak ditemukan.');
        }

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async checkCommentIsExist(commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 and is_deleted = false',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Komentar tidak ditemukan.');
        }
    }

    async detailCommentByThreadID(threadId) {
        const query = {
            text: `SELECT c.id, 
                c.content, 
                u.username, 
                c.created_at, 
                c.is_deleted as is_delete 
                FROM comments C 
                JOIN users u ON c.owner = u.id 
                WHERE c.thread = $1 
                ORDER BY c.created_at asc`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Komentar tidak ditemukan');
        }

        return result.rows.map((payload) => (
            new DetailComment({
                ...payload,
                created_at: payload.created_at.toISOString()
            })
        ));
    }

    async deleteCommentByID(commentId) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE comments SET is_deleted = true, updated_at = $1 WHERE id = $2',
            values: [updatedAt, commentId],
        };

        await this._pool.query(query);
    }
}

module.exports = CommentRepositoryPostgres;