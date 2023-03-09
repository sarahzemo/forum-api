const ThreadsUseCase = require('../../../../Applications/use_case/ThreadsUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadsHandler = this.postThreadsHandler.bind(this);
        this.getThreadsHandler = this.getThreadsHandler.bind(this);
    }

    async postThreadsHandler(request, h) {
        const threadsUseCase = this._container.getInstance(ThreadsUseCase.name);
        const { id: owner } = request.auth.credentials;
        const addThreadPayload = {
            title: request.payload.title,
            body: request.payload.body,
            owner
        }

        const addedThread = await threadsUseCase.executeAddThread(addThreadPayload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadsHandler(request, h) {
        const threadsUseCase = this._container.getInstance(ThreadsUseCase.name);
        const threadId = request.params.threadId;

        const thread = await threadsUseCase.executeDetailThread(threadId);
        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadsHandler;
