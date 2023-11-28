import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import { asapScheduler, timer, isObservable } from 'rxjs';
import { OBSERVABLE_TEST_TIMEOUT_IN_MS } from './types';
export function forceObservableCompletion(subscription, resolve) {
    const timeoutObservable = timer(OBSERVABLE_TEST_TIMEOUT_IN_MS, asapScheduler);
    subscription.add(timeoutObservable.subscribe(() => {
        subscription.unsubscribe();
        resolve({
            pass: false,
            message: () => `${matcherHint('.toEmitValues')}

    Expected ${printReceived('Observable')} to be ${printExpected(`completed within ${OBSERVABLE_TEST_TIMEOUT_IN_MS}ms`)} but it did not.`,
        });
    }));
}
export function expectObservableToBeDefined(received) {
    if (received) {
        return null;
    }
    return {
        pass: false,
        message: () => `${matcherHint('.toEmitValues')}

Expected ${printReceived(received)} to be ${printExpected('defined')}.`,
    };
}
export function expectObservableToBeObservable(received) {
    if (isObservable(received)) {
        return null;
    }
    return {
        pass: false,
        message: () => `${matcherHint('.toEmitValues')}

Expected ${printReceived(received)} to be ${printExpected('an Observable')}.`,
    };
}
export function expectObservable(received) {
    const toBeDefined = expectObservableToBeDefined(received);
    if (toBeDefined) {
        return toBeDefined;
    }
    const toBeObservable = expectObservableToBeObservable(received);
    if (toBeObservable) {
        return toBeObservable;
    }
    return null;
}
//# sourceMappingURL=utils.js.map