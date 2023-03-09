const AddComment = require('../../Domains/comments/entities/AddComment');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class CommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;

    }

    async executeAddComment(useCasePayload) {
        const addComment = new AddComment(useCasePayload);
        await this._threadRepository.getThreadById(addComment.threadId);
        return this._commentRepository.addComment(addComment);
    }

    async executeDeleteCommment(useCasePayload) {
        const { commentId, threadId, owner } = new DeleteComment(useCasePayload);
        await this._threadRepository.getThreadById(threadId);
        await this._commentRepository.verifyCommentOwner(commentId, owner);
        await this._commentRepository.deleteCommentByID(commentId);
    }
}

module.exports = CommentUseCase;