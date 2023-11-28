import { __awaiter } from "tslib";
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Databases } from 'app/percona/shared/core';
import { InstanceTypesExtra } from '../../panel.types';
import AddRemoteInstance from './AddRemoteInstance';
jest.mock('app/percona/shared/helpers/logger', () => {
    const originalModule = jest.requireActual('app/percona/shared/helpers/logger');
    return Object.assign(Object.assign({}, originalModule), { logger: {
            error: jest.fn(),
        } });
});
describe('Add remote instance:: ', () => {
    it('should render correct for mysql and postgres and highlight empty mandatory fields on submit', () => __awaiter(void 0, void 0, void 0, function* () {
        const type = Databases.mysql;
        render(React.createElement(AddRemoteInstance, { onSubmit: jest.fn(), instance: { type, credentials: {} }, selectInstance: jest.fn() }));
        expect(screen.getByTestId('address-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('username-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('password-password-input').classList.contains('invalid')).toBe(false);
        fireEvent.submit(screen.getByTestId('add-remote-instance-form'), {});
        expect(screen.getByTestId('address-text-input').classList.contains('invalid')).toBe(true);
        expect(screen.getByTestId('username-text-input').classList.contains('invalid')).toBe(true);
        expect(screen.getByTestId('password-password-input').classList.contains('invalid')).toBe(true);
    }));
    it('should render for external service and highlight empty mandatory fields on submit', () => __awaiter(void 0, void 0, void 0, function* () {
        const type = InstanceTypesExtra.external;
        render(React.createElement(AddRemoteInstance, { onSubmit: jest.fn(), instance: { type, credentials: {} }, selectInstance: jest.fn() }));
        expect(screen.getByTestId('address-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('metrics_path-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('port-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('username-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('password-password-input').classList.contains('invalid')).toBe(false);
        fireEvent.submit(screen.getByTestId('add-remote-instance-form'), {});
        expect(screen.getByTestId('address-text-input').classList.contains('invalid')).toBe(true);
        expect(screen.getByTestId('metrics_path-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('port-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('username-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('password-password-input').classList.contains('invalid')).toBe(false);
    }));
    it('should render correct for HAProxy and highlight empty mandatory fields on submit', () => __awaiter(void 0, void 0, void 0, function* () {
        const type = Databases.haproxy;
        render(React.createElement(AddRemoteInstance, { onSubmit: jest.fn(), instance: { type, credentials: {} }, selectInstance: jest.fn() }));
        expect(screen.getByTestId('address-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('username-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('password-password-input').classList.contains('invalid')).toBe(false);
        fireEvent.submit(screen.getByTestId('add-remote-instance-form'), {});
        expect(screen.getByTestId('address-text-input').classList.contains('invalid')).toBe(true);
        expect(screen.getByTestId('username-text-input').classList.contains('invalid')).toBe(false);
        expect(screen.getByTestId('password-password-input').classList.contains('invalid')).toBe(false);
    }));
});
//# sourceMappingURL=AddRemoteInstance.test.js.map