const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadsUseCase {
    constructor({ threadsRespository, commentRepository }) {
        this._threadsRespository = threadsRespository;
        this._commentRepository = commentRepository;
    }

    async executeAddThread(useCasePayload) {
        const addThread = new AddThread(useCasePayload);
        return this._threadsRespository.saveThread(addThread);
    }

    async executeDetailThread(threadId) {
        const thread = await this._threadsRespository.getDetailThreadById(threadId);
        const comments = await this._commentRepository.detailCommentByThreadID(threadId);
        const result = {
            ...thread,
            comments,
        };

        return result;
    }
}

module.exports = ThreadsUseCase;