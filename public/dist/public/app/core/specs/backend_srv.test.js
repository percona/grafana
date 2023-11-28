import { __awaiter } from "tslib";
import 'whatwg-fetch'; // fetch polyfill needed for PhantomJs rendering
import { Observable, of, lastValueFrom } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { delay } from 'rxjs/operators';
import { AppEvents, DataQueryErrorType } from '@grafana/data';
import { config } from '@grafana/runtime';
import { TokenRevokedModal } from '../../features/users/TokenRevokedModal';
import { ShowModalReactEvent } from '../../types/events';
import { BackendSrv } from '../services/backend_srv';
const getTestContext = (overides, mockFromFetch = true) => {
    const defaults = {
        data: { test: 'hello world' },
        ok: true,
        status: 200,
        statusText: 'Ok',
        isSignedIn: true,
        orgId: 1337,
        redirected: false,
        type: 'basic',
        url: 'http://localhost:3000/api/some-mock',
        headers: new Map(),
    };
    const props = Object.assign(Object.assign({}, defaults), overides);
    const textMock = jest.fn().mockResolvedValue(JSON.stringify(props.data));
    const fromFetchMock = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            ok: props.ok,
            status: props.status,
            statusText: props.statusText,
            headers: props.headers,
            text: textMock,
            redirected: false,
            type: 'basic',
            url: 'http://localhost:3000/api/some-mock',
        };
        return of(mockedResponse);
    });
    const appEventsMock = {
        emit: jest.fn(),
        publish: jest.fn(),
    };
    const user = {
        isSignedIn: props.isSignedIn,
        orgId: props.orgId,
    };
    const contextSrvMock = {
        user,
    };
    const logoutMock = jest.fn();
    const parseRequestOptionsMock = jest.fn().mockImplementation((options) => options);
    const backendSrv = new BackendSrv({
        fromFetch: mockFromFetch ? fromFetchMock : fromFetch,
        appEvents: appEventsMock,
        contextSrv: contextSrvMock,
        logout: logoutMock,
    });
    backendSrv['parseRequestOptions'] = parseRequestOptionsMock;
    const expectCallChain = (calls = 1) => {
        expect(fromFetchMock).toHaveBeenCalledTimes(calls);
    };
    const expectRequestCallChain = (options, calls = 1) => {
        expect(parseRequestOptionsMock).toHaveBeenCalledTimes(1);
        expect(parseRequestOptionsMock).toHaveBeenCalledWith(options);
        expectCallChain(calls);
    };
    return {
        backendSrv,
        fromFetchMock,
        appEventsMock,
        contextSrvMock,
        textMock,
        logoutMock,
        parseRequestOptionsMock,
        expectRequestCallChain,
    };
};
describe('backendSrv', () => {
    describe('parseRequestOptions', () => {
        it.each `
      retry        | url                                      | headers                           | orgId        | noBackendCache | expected
      ${undefined} | ${'http://localhost:3000/api/dashboard'} | ${undefined}                      | ${undefined} | ${undefined}   | ${{ hideFromInspector: false, retry: 0, url: 'http://localhost:3000/api/dashboard' }}
      ${1}         | ${'http://localhost:3000/api/dashboard'} | ${{ Authorization: 'Some Auth' }} | ${1}         | ${true}        | ${{ hideFromInspector: false, retry: 1, url: 'http://localhost:3000/api/dashboard', headers: { Authorization: 'Some Auth' } }}
      ${undefined} | ${'api/dashboard'}                       | ${undefined}                      | ${undefined} | ${undefined}   | ${{ hideFromInspector: true, retry: 0, url: 'api/dashboard' }}
      ${undefined} | ${'/api/dashboard'}                      | ${undefined}                      | ${undefined} | ${undefined}   | ${{ hideFromInspector: true, retry: 0, url: 'api/dashboard' }}
      ${undefined} | ${'/api/dashboard/'}                     | ${undefined}                      | ${undefined} | ${undefined}   | ${{ hideFromInspector: true, retry: 0, url: 'api/dashboard/' }}
      ${undefined} | ${'/api/dashboard/'}                     | ${{ Authorization: 'Some Auth' }} | ${undefined} | ${undefined}   | ${{ hideFromInspector: true, retry: 0, url: 'api/dashboard/', headers: { 'X-DS-Authorization': 'Some Auth' } }}
      ${undefined} | ${'/api/dashboard/'}                     | ${{ Authorization: 'Some Auth' }} | ${1}         | ${undefined}   | ${{ hideFromInspector: true, retry: 0, url: 'api/dashboard/', headers: { 'X-DS-Authorization': 'Some Auth', 'X-Grafana-Org-Id': 1 } }}
      ${undefined} | ${'/api/dashboard/'}                     | ${{ Authorization: 'Some Auth' }} | ${1}         | ${true}        | ${{ hideFromInspector: true, retry: 0, url: 'api/dashboard/', headers: { 'X-DS-Authorization': 'Some Auth', 'X-Grafana-Org-Id': 1, 'X-Grafana-NoCache': 'true' } }}
      ${1}         | ${'/api/dashboard/'}                     | ${undefined}                      | ${undefined} | ${undefined}   | ${{ hideFromInspector: true, retry: 1, url: 'api/dashboard/' }}
      ${1}         | ${'/api/dashboard/'}                     | ${{ Authorization: 'Some Auth' }} | ${undefined} | ${undefined}   | ${{ hideFromInspector: true, retry: 1, url: 'api/dashboard/', headers: { 'X-DS-Authorization': 'Some Auth' } }}
      ${1}         | ${'/api/dashboard/'}                     | ${{ Authorization: 'Some Auth' }} | ${1}         | ${undefined}   | ${{ hideFromInspector: true, retry: 1, url: 'api/dashboard/', headers: { 'X-DS-Authorization': 'Some Auth', 'X-Grafana-Org-Id': 1 } }}
      ${1}         | ${'/api/dashboard/'}                     | ${{ Authorization: 'Some Auth' }} | ${1}         | ${true}        | ${{ hideFromInspector: true, retry: 1, url: 'api/dashboard/', headers: { 'X-DS-Authorization': 'Some Auth', 'X-Grafana-Org-Id': 1, 'X-Grafana-NoCache': 'true' } }}
      ${undefined} | ${'api/datasources/proxy'}               | ${undefined}                      | ${undefined} | ${undefined}   | ${{ hideFromInspector: false, retry: 0, url: 'api/datasources/proxy' }}
    `("when called with retry: '$retry', url: '$url' and orgId: '$orgId' then result should be '$expected'", ({ retry, url, headers, orgId, noBackendCache, expected }) => __awaiter(void 0, void 0, void 0, function* () {
            const srv = new BackendSrv({
                contextSrv: {
                    user: {
                        orgId: orgId,
                    },
                },
            });
            if (noBackendCache) {
                yield srv.withNoBackendCache(() => __awaiter(void 0, void 0, void 0, function* () {
                    expect(srv['parseRequestOptions']({ retry, url, headers })).toEqual(expected);
                }));
            }
            else {
                expect(srv['parseRequestOptions']({ retry, url, headers })).toEqual(expected);
            }
        }));
    });
    describe('request', () => {
        const testMessage = 'Datasource updated';
        const errorMessage = 'UnAuthorized';
        describe('when making a successful call and conditions for showSuccessAlert are not favorable', () => {
            it('then it should return correct result and not emit anything', () => __awaiter(void 0, void 0, void 0, function* () {
                const { backendSrv, appEventsMock, expectRequestCallChain } = getTestContext({
                    data: { message: testMessage },
                });
                const url = '/api/dashboard/';
                const result = yield backendSrv.request({ url, method: 'DELETE', showSuccessAlert: false });
                expect(result).toEqual({ message: testMessage });
                expect(appEventsMock.emit).not.toHaveBeenCalled();
                expectRequestCallChain({ url, method: 'DELETE', showSuccessAlert: false });
            }));
        });
        describe('when making a successful call and conditions for showSuccessAlert are favorable', () => {
            it('then it should emit correct message', () => __awaiter(void 0, void 0, void 0, function* () {
                const { backendSrv, appEventsMock, expectRequestCallChain } = getTestContext({
                    data: { message: testMessage },
                });
                const url = '/api/dashboard/';
                const result = yield backendSrv.request({ url, method: 'DELETE', showSuccessAlert: true });
                expect(result).toEqual({ message: testMessage });
                expect(appEventsMock.emit).toHaveBeenCalledTimes(1);
                expect(appEventsMock.emit).toHaveBeenCalledWith(AppEvents.alertSuccess, [testMessage]);
                expectRequestCallChain({ url, method: 'DELETE', showSuccessAlert: true });
            }));
        });
        describe('when making an unsuccessful call and conditions for retry are favorable and loginPing does not throw', () => {
            const url = '/api/dashboard/';
            const okResponse = { ok: true, status: 200, statusText: 'OK', data: { message: 'Ok' } };
            let fetchMock;
            afterEach(() => {
                fetchMock.mockClear();
            });
            afterAll(() => {
                fetchMock.mockRestore();
                config.featureToggles.clientTokenRotation = false;
            });
            it.each `
        clientTokenRotation
        ${true}
        ${false}
      `('then it should retry (clientTokenRotation = %s)', ({ clientTokenRotation }) => __awaiter(void 0, void 0, void 0, function* () {
                config.featureToggles.clientTokenRotation = clientTokenRotation;
                fetchMock = jest
                    .spyOn(global, 'fetch')
                    .mockRejectedValueOnce({
                    ok: false,
                    status: 401,
                    statusText: errorMessage,
                    headers: new Map(),
                    text: jest.fn().mockResolvedValue(JSON.stringify({ test: 'hello world' })),
                    data: { message: errorMessage },
                    url,
                })
                    .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    headers: new Map(),
                    text: jest.fn().mockResolvedValue(JSON.stringify({ test: 'hello world' })),
                    data: { message: 'OK' },
                    url,
                });
                const { backendSrv, appEventsMock, logoutMock } = getTestContext({
                    ok: false,
                    status: 401,
                    statusText: errorMessage,
                    data: { message: errorMessage },
                    url,
                }, false);
                backendSrv.loginPing = jest.fn().mockResolvedValue(okResponse);
                backendSrv.rotateToken = jest.fn().mockResolvedValue(okResponse);
                yield backendSrv.request({ url, method: 'GET', retry: 0 }).finally(() => {
                    expect(appEventsMock.emit).not.toHaveBeenCalled();
                    expect(logoutMock).not.toHaveBeenCalled();
                    if (config.featureToggles.clientTokenRotation) {
                        expect(backendSrv.rotateToken).toHaveBeenCalledTimes(1);
                    }
                    else {
                        expect(backendSrv.loginPing).toHaveBeenCalledTimes(1);
                    }
                    expect(fetchMock).toHaveBeenCalledTimes(2); // expecting 2 calls because of retry and because the loginPing/tokenRotation is mocked
                });
            }));
        });
        describe('when making an unsuccessful call because of soft token revocation', () => {
            it('then it should dispatch show Token Revoked modal event', () => __awaiter(void 0, void 0, void 0, function* () {
                const url = '/api/dashboard/';
                const { backendSrv, appEventsMock, logoutMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 401,
                    statusText: errorMessage,
                    data: { message: 'Token revoked', error: { id: 'ERR_TOKEN_REVOKED', maxConcurrentSessions: 3 } },
                    url,
                });
                backendSrv.loginPing = jest.fn();
                yield backendSrv.request({ url, method: 'GET', retry: 0 }).catch(() => {
                    expect(appEventsMock.publish).toHaveBeenCalledTimes(1);
                    expect(appEventsMock.publish).toHaveBeenCalledWith(new ShowModalReactEvent({
                        component: TokenRevokedModal,
                        props: {
                            maxConcurrentSessions: 3,
                        },
                    }));
                    expect(backendSrv.loginPing).not.toHaveBeenCalled();
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain({ url, method: 'GET', retry: 0 });
                });
            }));
        });
        describe('when making an unsuccessful call and conditions for retry are favorable and retry throws', () => {
            it('then it throw error', () => __awaiter(void 0, void 0, void 0, function* () {
                jest.useFakeTimers();
                const { backendSrv, appEventsMock, logoutMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 401,
                    statusText: errorMessage,
                    data: { message: errorMessage },
                });
                backendSrv.loginPing = jest
                    .fn()
                    .mockRejectedValue({ status: 403, statusText: 'Forbidden', data: { message: 'Forbidden' } });
                const url = '/api/dashboard/';
                yield backendSrv
                    .request({ url, method: 'GET', retry: 0 })
                    .catch((error) => {
                    expect(error.status).toBe(403);
                    expect(error.statusText).toBe('Forbidden');
                    expect(error.data).toEqual({ message: 'Forbidden' });
                    expect(appEventsMock.emit).not.toHaveBeenCalled();
                    expect(backendSrv.loginPing).toHaveBeenCalledTimes(1);
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain({ url, method: 'GET', retry: 0 });
                    jest.advanceTimersByTime(50);
                })
                    .catch((error) => {
                    expect(error).toEqual({ message: 'Forbidden' });
                    expect(appEventsMock.emit).toHaveBeenCalledTimes(1);
                    expect(appEventsMock.emit).toHaveBeenCalledWith(AppEvents.alertWarning, ['Forbidden', '']);
                });
            }));
        });
        describe('when showing error alert', () => {
            describe('when showErrorAlert is undefined and url is a normal api call', () => {
                it('It should emit alert event for normal api errors', () => __awaiter(void 0, void 0, void 0, function* () {
                    const { backendSrv, appEventsMock } = getTestContext({});
                    backendSrv.showErrorAlert({
                        url: 'api/do/something',
                    }, {
                        data: {
                            message: 'Something failed',
                            error: 'Error',
                            traceID: 'bogus-trace-id',
                        },
                    });
                    expect(appEventsMock.emit).toHaveBeenCalledWith(AppEvents.alertError, [
                        'Something failed',
                        '',
                        'bogus-trace-id',
                    ]);
                }));
                it('It should favor error.message for fetch errors when error.data.message is Unexpected error', () => __awaiter(void 0, void 0, void 0, function* () {
                    const { backendSrv, appEventsMock } = getTestContext({});
                    backendSrv.showErrorAlert({
                        url: 'api/do/something',
                    }, {
                        data: {
                            message: 'Unexpected error',
                        },
                        message: 'Failed to fetch',
                        status: 500,
                        config: {
                            url: '',
                        },
                    });
                    expect(appEventsMock.emit).toHaveBeenCalledWith(AppEvents.alertError, ['Failed to fetch', '']);
                }));
            });
        });
        describe('when making an unsuccessful 422 call', () => {
            it('then it should emit Validation failed message', () => __awaiter(void 0, void 0, void 0, function* () {
                jest.useFakeTimers();
                const { backendSrv, appEventsMock, logoutMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 422,
                    statusText: 'Unprocessable Entity',
                    data: { message: 'Unprocessable Entity' },
                });
                const url = '/api/dashboard/';
                yield backendSrv
                    .request({ url, method: 'GET' })
                    .catch((error) => {
                    expect(error.status).toBe(422);
                    expect(error.statusText).toBe('Unprocessable Entity');
                    expect(error.data).toEqual({ message: 'Unprocessable Entity' });
                    expect(appEventsMock.emit).not.toHaveBeenCalled();
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain({ url, method: 'GET' });
                    jest.advanceTimersByTime(50);
                })
                    .catch((error) => {
                    expect(error).toEqual({ message: 'Unprocessable Entity' });
                    expect(appEventsMock.emit).toHaveBeenCalledTimes(1);
                    expect(appEventsMock.emit).toHaveBeenCalledWith(AppEvents.alertWarning, [
                        'Validation failed',
                        'Unprocessable Entity',
                    ]);
                });
            }));
        });
        describe('when making an unsuccessful call and we handle the error', () => {
            it('then it should not emit message', () => __awaiter(void 0, void 0, void 0, function* () {
                jest.useFakeTimers();
                const { backendSrv, appEventsMock, logoutMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 404,
                    statusText: 'Not found',
                    data: { message: 'Not found' },
                });
                const url = '/api/dashboard/';
                yield backendSrv.request({ url, method: 'GET' }).catch((error) => {
                    expect(error.status).toBe(404);
                    expect(error.statusText).toBe('Not found');
                    expect(error.data).toEqual({ message: 'Not found' });
                    expect(appEventsMock.emit).not.toHaveBeenCalled();
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain({ url, method: 'GET' });
                    error.isHandled = true;
                    jest.advanceTimersByTime(50);
                    expect(appEventsMock.emit).not.toHaveBeenCalled();
                });
            }));
        });
        describe('traceId handling', () => {
            const opts = { url: '/something', method: 'GET' };
            it('should handle a success-response without traceId', () => __awaiter(void 0, void 0, void 0, function* () {
                const ctx = getTestContext({ status: 200, statusText: 'OK', headers: new Headers() });
                const res = yield lastValueFrom(ctx.backendSrv.fetch(opts));
                expect(res.traceId).toBeUndefined();
            }));
            it('should handle a success-response with traceId', () => __awaiter(void 0, void 0, void 0, function* () {
                const ctx = getTestContext({
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({
                        'grafana-trace-id': 'traceId1',
                    }),
                });
                const res = yield lastValueFrom(ctx.backendSrv.fetch(opts));
                expect(res.traceId).toBe('traceId1');
            }));
            it('should handle an error-response without traceId', () => {
                const ctx = getTestContext({
                    ok: false,
                    status: 500,
                    statusText: 'INTERNAL SERVER ERROR',
                    headers: new Headers(),
                });
                return lastValueFrom(ctx.backendSrv.fetch(opts)).then((data) => {
                    throw new Error('must not get here');
                }, (error) => {
                    expect(error.traceId).toBeUndefined();
                });
            });
            it('should handle an error-response with traceId', () => {
                const ctx = getTestContext({
                    ok: false,
                    status: 500,
                    statusText: 'INTERNAL SERVER ERROR',
                    headers: new Headers({
                        'grafana-trace-id': 'traceId1',
                    }),
                });
                return lastValueFrom(ctx.backendSrv.fetch(opts)).then((data) => {
                    throw new Error('must not get here');
                }, (error) => {
                    expect(error.traceId).toBe('traceId1');
                });
            });
        });
    });
    describe('datasourceRequest', () => {
        describe('when called with the same requestId twice', () => {
            it('then it should cancel the first call and the first call should be unsubscribed', () => __awaiter(void 0, void 0, void 0, function* () {
                const url = '/api/dashboard/';
                const { backendSrv, fromFetchMock } = getTestContext({ url });
                const unsubscribe = jest.fn();
                const slowData = { message: 'Slow Request' };
                const slowFetch = new Observable((subscriber) => {
                    subscriber.next({
                        ok: true,
                        status: 200,
                        statusText: 'Ok',
                        headers: new Map(),
                        text: () => Promise.resolve(JSON.stringify(slowData)),
                        redirected: false,
                        type: 'basic',
                        url,
                    });
                    return unsubscribe;
                }).pipe(delay(10000));
                const fastData = { message: 'Fast Request' };
                const fastFetch = of({
                    ok: true,
                    status: 200,
                    statusText: 'Ok',
                    headers: new Map(),
                    text: () => Promise.resolve(JSON.stringify(fastData)),
                    redirected: false,
                    type: 'basic',
                    url,
                });
                fromFetchMock.mockImplementationOnce(() => slowFetch);
                fromFetchMock.mockImplementation(() => fastFetch);
                const options = {
                    url,
                    method: 'GET',
                    requestId: 'A',
                };
                let slowError = null;
                backendSrv.request(options).catch((err) => {
                    slowError = err;
                });
                const fastResponse = yield backendSrv.request(options);
                expect(fastResponse).toEqual({
                    message: 'Fast Request',
                });
                expect(unsubscribe).toHaveBeenCalledTimes(1);
                expect(slowError).toEqual({
                    type: DataQueryErrorType.Cancelled,
                    cancelled: true,
                    data: null,
                    status: -1,
                    statusText: 'Request was aborted',
                    config: options,
                });
            }));
        });
        describe('when making an unsuccessful call and conditions for retry are favorable and loginPing does not throw', () => {
            const url = '/api/dashboard/';
            const okResponse = { ok: true, status: 200, statusText: 'OK', data: { message: 'Ok' } };
            let fetchMock;
            afterEach(() => {
                fetchMock.mockClear();
            });
            afterAll(() => {
                fetchMock.mockRestore();
                config.featureToggles.clientTokenRotation = false;
            });
            it.each `
        clientTokenRotation
        ${true}
        ${false}
      `('then it should retry (clientTokenRotation = %s)', ({ clientTokenRotation }) => __awaiter(void 0, void 0, void 0, function* () {
                config.featureToggles.clientTokenRotation = clientTokenRotation;
                fetchMock = jest
                    .spyOn(global, 'fetch')
                    .mockRejectedValueOnce({
                    ok: false,
                    status: 401,
                    statusText: 'UnAuthorized',
                    headers: new Map(),
                    text: jest.fn().mockResolvedValue(JSON.stringify({ test: 'hello world' })),
                    data: { message: 'UnAuthorized' },
                    url,
                })
                    .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    headers: new Map(),
                    text: jest.fn().mockResolvedValue(JSON.stringify({ test: 'hello world' })),
                    data: { message: 'OK' },
                    url,
                });
                const { backendSrv, logoutMock } = getTestContext({
                    ok: false,
                    status: 401,
                    statusText: 'UnAuthorized',
                    data: { message: 'UnAuthorized' },
                }, false);
                backendSrv.loginPing = jest.fn().mockResolvedValue(okResponse);
                backendSrv.rotateToken = jest.fn().mockResolvedValue(okResponse);
                yield backendSrv.datasourceRequest({ url, method: 'GET', retry: 0 }).finally(() => {
                    expect(logoutMock).not.toHaveBeenCalled();
                    if (config.featureToggles.clientTokenRotation) {
                        expect(backendSrv.rotateToken).toHaveBeenCalledTimes(1);
                    }
                    else {
                        expect(backendSrv.loginPing).toHaveBeenCalledTimes(1);
                    }
                    expect(fetchMock).toHaveBeenCalledTimes(2); // expecting 2 calls because of retry and because the loginPing/tokenRotation is mocked
                });
            }));
        });
        describe('when making an unsuccessful call because of soft token revocation', () => {
            it('then it should dispatch show Token Revoked modal event', () => __awaiter(void 0, void 0, void 0, function* () {
                const { backendSrv, logoutMock, appEventsMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 401,
                    statusText: 'UnAuthorized',
                    data: { message: 'Token revoked', error: { id: 'ERR_TOKEN_REVOKED', maxConcurrentSessions: 3 } },
                });
                backendSrv.loginPing = jest.fn();
                const url = '/api/dashboard/';
                yield backendSrv.datasourceRequest({ url, method: 'GET', retry: 0 }).catch((error) => {
                    expect(appEventsMock.publish).toHaveBeenCalledTimes(1);
                    expect(appEventsMock.publish).toHaveBeenCalledWith(new ShowModalReactEvent({
                        component: TokenRevokedModal,
                        props: {
                            maxConcurrentSessions: 3,
                        },
                    }));
                    expect(backendSrv.loginPing).not.toHaveBeenCalled();
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain({ url, method: 'GET', retry: 0 });
                });
            }));
        });
        describe('when making an unsuccessful call and conditions for retry are favorable and retry throws', () => {
            it('then it throw error', () => __awaiter(void 0, void 0, void 0, function* () {
                const { backendSrv, logoutMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 401,
                    statusText: 'UnAuthorized',
                    data: { message: 'UnAuthorized' },
                });
                const options = {
                    url: '/api/dashboard/',
                    method: 'GET',
                    retry: 0,
                };
                backendSrv.loginPing = jest
                    .fn()
                    .mockRejectedValue({ status: 403, statusText: 'Forbidden', data: { message: 'Forbidden' } });
                yield backendSrv.datasourceRequest(options).catch((error) => {
                    expect(error.status).toBe(403);
                    expect(error.statusText).toBe('Forbidden');
                    expect(error.data).toEqual({ message: 'Forbidden' });
                    expect(backendSrv.loginPing).toHaveBeenCalledTimes(1);
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain(options);
                });
            }));
        });
        describe('when making an Internal Error call', () => {
            it('then it should throw cancelled error', () => __awaiter(void 0, void 0, void 0, function* () {
                const { backendSrv, logoutMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 500,
                    statusText: 'Internal Server Error',
                    data: 'Internal Server Error',
                });
                const options = {
                    url: '/api/dashboard/',
                    method: 'GET',
                };
                yield backendSrv.datasourceRequest(options).catch((error) => {
                    expect(error).toEqual({
                        status: 500,
                        statusText: 'Internal Server Error',
                        config: options,
                        data: {
                            error: 'Internal Server Error',
                            response: 'Internal Server Error',
                            message: 'Internal Server Error',
                        },
                    });
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain(options);
                });
            }));
        });
        describe('when formatting prometheus error', () => {
            it('then it should throw cancelled error', () => __awaiter(void 0, void 0, void 0, function* () {
                const { backendSrv, logoutMock, expectRequestCallChain } = getTestContext({
                    ok: false,
                    status: 403,
                    statusText: 'Forbidden',
                    data: { error: 'Forbidden' },
                });
                const options = {
                    url: '/api/dashboard/',
                    method: 'GET',
                };
                let inspectorPacket;
                backendSrv.getInspectorStream().subscribe({
                    next: (rsp) => (inspectorPacket = rsp),
                });
                yield backendSrv.datasourceRequest(options).catch((error) => {
                    expect(error).toEqual({
                        status: 403,
                        statusText: 'Forbidden',
                        config: options,
                        data: {
                            error: 'Forbidden',
                            message: 'Forbidden',
                        },
                    });
                    expect(inspectorPacket).toEqual(error);
                    expect(logoutMock).not.toHaveBeenCalled();
                    expectRequestCallChain(options);
                });
            }));
        });
    });
    describe('cancelAllInFlightRequests', () => {
        describe('when called with 2 separate requests and then cancelAllInFlightRequests is called', () => {
            const url = '/api/dashboard/';
            const getRequestObservable = (message, unsubscribe) => new Observable((subscriber) => {
                subscriber.next({
                    ok: true,
                    status: 200,
                    statusText: 'Ok',
                    text: () => Promise.resolve(JSON.stringify({ message })),
                    headers: {
                        map: {
                            'content-type': 'application/json',
                        },
                    },
                    redirected: false,
                    type: 'basic',
                    url,
                });
                return unsubscribe;
            }).pipe(delay(10000));
            it('then it both requests should be cancelled and unsubscribed', () => __awaiter(void 0, void 0, void 0, function* () {
                const unsubscribe = jest.fn();
                const { backendSrv, fromFetchMock } = getTestContext({ url });
                const firstObservable = getRequestObservable('First', unsubscribe);
                const secondObservable = getRequestObservable('Second', unsubscribe);
                fromFetchMock.mockImplementationOnce(() => firstObservable);
                fromFetchMock.mockImplementation(() => secondObservable);
                const options = {
                    url,
                    method: 'GET',
                };
                const firstRequest = backendSrv.request(options);
                const secondRequest = backendSrv.request(options);
                backendSrv.cancelAllInFlightRequests();
                let catchedError = null;
                try {
                    yield Promise.all([firstRequest, secondRequest]);
                }
                catch (err) {
                    catchedError = err;
                }
                expect(catchedError.type).toEqual(DataQueryErrorType.Cancelled);
                expect(catchedError.statusText).toEqual('Request was aborted');
                expect(unsubscribe).toHaveBeenCalledTimes(2);
            }));
        });
    });
});
//# sourceMappingURL=backend_srv.test.js.map