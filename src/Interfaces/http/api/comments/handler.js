const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentsHandler = this.postCommentsHandler.bind(this);
        this.deleteCommentsHandler = this.deleteCommentsHandler.bind(this);
    }

    async postCommentsHandler(request, h) {
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const addCommentPayload = {
            content: request.payload.content,
            threadId: request.params.threadId,
            owner: request.auth.credentials.id
        }

        const addedComment = await commentUseCase.executeAddComment(addCommentPayload);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentsHandler(request, h) {
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const deleteCommentPayload = {
            commentId: request.params.commentId,
            threadId: request.params.threadId,
            owner: request.auth.credentials.id
        }

        await commentUseCase.executeDeleteCommment(deleteCommentPayload);
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = CommentsHandler;