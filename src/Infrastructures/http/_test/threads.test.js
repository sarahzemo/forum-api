const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted threads', async () => {
            //Arrange
            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestAddThreadPayload = {
                title: 'Coba thread',
                body: 'Hai ini percobaan pembuatan thread loh..',
            };
            const server = await createServer(container);

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });

            const respAuthJSON = JSON.parse(respAuth.payload);

            const respAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });


            //Assert
            const respAddThreadJSON = JSON.parse(respAddThread.payload);
            expect(respAddThread.statusCode).toEqual(201);
            expect(respAddThreadJSON.status).toEqual('success');
            expect(respAddThreadJSON.data.addedThread).toBeDefined();
            expect(respAddThreadJSON.data.addedThread.title).toEqual(requestAddThreadPayload.title);
        });

        it('should response 400 when request payload not contain needed property', async () => {
            //Arrange
            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestAddThreadPayload = {
                title: 'Coba thread',
            };
            const server = await createServer(container);

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });

            const respAuthJSON = JSON.parse(respAuth.payload);

            const respAddThread = await server.inject({
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload
            });

            //Assert
            const respAddThreadJSON = JSON.parse(respAddThread.payload);
            expect(respAddThread.statusCode).toEqual(400);
            expect(respAddThreadJSON.status).toEqual('fail');
            expect(respAddThreadJSON.message).toBeDefined();
            expect(respAddThreadJSON.message).toEqual('harus mengirimkan title dan body');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            //Arrange
            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestAddThreadPayload = {
                title: 123,
                body: 'test body'
            };
            const server = await createServer(container);

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });

            const respAuthJSON = JSON.parse(respAuth.payload);

            const respAddThread = await server.inject({
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload
            });

            //Assert
            const respAddThreadJSON = JSON.parse(respAddThread.payload);
            expect(respAddThread.statusCode).toEqual(400);
            expect(respAddThreadJSON.status).toEqual('fail');
            expect(respAddThreadJSON.message).toBeDefined();
            expect(respAddThreadJSON.message).toEqual('title dan body harus string');
        });
    });

    describe('when GET /threads ', () => {
        it('should response 404 when thread not valid', async () => {
            //Arrange
            const server = await createServer(container);

            //Action            
            const respDetailThread = await server.inject({
                method: 'GET',
                url: '/threads/thread-111',
            });

            //Assert
            const respDetailThreadJSON = JSON.parse(respDetailThread.payload);
            expect(respDetailThread.statusCode).toEqual(404);
            expect(respDetailThreadJSON.status).toEqual('fail');
            expect(respDetailThreadJSON.message).toBeDefined();
            expect(respDetailThreadJSON.message).toEqual('Thread tidak ditemukan');
        });

        it('should response 200 and persisted threads', async () => {
            //Arrange
            const server = await createServer(container);

            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });

            const respAuthJSON = JSON.parse(respAuth.payload);

            const requestAddThreadPayload = {
                title: 'Coba thread',
                body: 'Hai ini percobaan pembuatan thread loh..',
            };

            const respAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            const respAddThreadJSON = JSON.parse(respAddThread.payload);

            const requestAddCommnetsPayload = {
                content: 'Ini komentar loh',
            };

            const respAddComment = await server.inject({
                method: 'POST',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments`,
                payload: requestAddCommnetsPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });
            const respAddCommentJSON = JSON.parse(respAddComment.payload);

            const requestAddCommnets2Payload = {
                content: 'Ini komentar 2 loh',
            };

            await server.inject({
                method: 'POST',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments`,
                payload: requestAddCommnets2Payload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            const respGetDetailThread = await server.inject({
                method: 'GET',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}`
            });

            //Assert
            const respGetDetailThreadJSON = JSON.parse(respGetDetailThread.payload);
            expect(respGetDetailThread.statusCode).toEqual(200);
            expect(respGetDetailThreadJSON.status).toEqual('success');
            expect(respGetDetailThreadJSON.data.thread).toBeDefined();
            expect(respGetDetailThreadJSON.data.thread.id).toEqual(respAddThreadJSON.data.addedThread.id);
            expect(respGetDetailThreadJSON.data.thread.title).toEqual(respAddThreadJSON.data.addedThread.title);
            expect(respGetDetailThreadJSON.data.thread.comments).toBeDefined();
            expect(respGetDetailThreadJSON.data.thread.comments[0].id).toEqual(respAddCommentJSON.data.addedComment.id);
        });
    });
});