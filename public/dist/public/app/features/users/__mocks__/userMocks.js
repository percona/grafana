import { initialState } from '../state/reducers';
export const getFetchUsersMock = (amount) => {
    const users = getMockUsers(amount);
    return {
        orgUsers: users,
        perPage: initialState.perPage,
        page: initialState.page,
        totalCount: initialState.totalPages,
    };
};
export const getMockUsers = (amount) => {
    const users = [];
    for (let i = 0; i <= amount; i++) {
        users.push({
            avatarUrl: 'url/to/avatar',
            email: `user-${i}@test.com`,
            name: `user-${i} test`,
            lastSeenAt: '2018-10-01',
            lastSeenAtAge: '',
            login: `user-${i}`,
            orgId: 1,
            role: 'Admin',
            userId: i,
            isDisabled: false,
            authLabels: [],
        });
    }
    return users;
};
export const getMockUser = () => {
    return {
        avatarUrl: 'url/to/avatar',
        email: `user@test.com`,
        name: 'user test',
        lastSeenAt: '2018-10-01',
        lastSeenAtAge: '',
        login: `user`,
        orgId: 1,
        role: 'Admin',
        userId: 2,
    };
};
export const getMockInvitees = (amount) => {
    const invitees = [];
    for (let i = 0; i <= amount; i++) {
        invitees.push({
            code: `asdfasdfsadf-${i}`,
            createdOn: '2018-10-02',
            email: `invitee-${i}@test.com`,
            emailSent: true,
            emailSentOn: '2018-10-02',
            id: i,
            invitedByEmail: 'admin@grafana.com',
            invitedByLogin: 'admin',
            invitedByName: 'admin',
            name: `invitee-${i}`,
            orgId: 1,
            role: 'viewer',
            status: 'not accepted',
            url: `localhost/invite/${i}`,
        });
    }
    return invitees;
};
//# sourceMappingURL=userMocks.js.map