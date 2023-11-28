import { __awaiter } from "tslib";
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { getGrafanaContextMock } from 'test/mocks/getGrafanaContextMock';
import { selectors } from '@grafana/e2e-selectors';
import { locationService } from '@grafana/runtime';
import { GrafanaContext } from 'app/core/context/GrafanaContext';
import { configureStore } from '../../../../store/configureStore';
import { createDashboardModelFixture } from '../../state/__fixtures__/dashboardFixtures';
import { DashboardSettings } from './DashboardSettings';
function setup(dashboard) {
    const store = configureStore();
    const sectionNav = {
        main: { text: 'Dashboard' },
        node: {
            text: 'Links',
        },
    };
    // Need to use DashboardSettings here as it's responsible for fetching the state back from location
    return render(React.createElement(GrafanaContext.Provider, { value: getGrafanaContextMock() },
        React.createElement(Provider, { store: store },
            React.createElement(Router, { history: locationService.getHistory() },
                React.createElement(DashboardSettings, { editview: "links", dashboard: dashboard, sectionNav: sectionNav, pageNav: sectionNav.node })))));
}
function buildTestDashboard() {
    return createDashboardModelFixture({
        links: [
            {
                asDropdown: false,
                icon: 'external link',
                includeVars: false,
                keepTime: false,
                tags: [],
                targetBlank: false,
                title: 'link 1',
                tooltip: '',
                type: 'link',
                url: 'https://www.google.com',
            },
            {
                asDropdown: false,
                icon: 'external link',
                includeVars: false,
                keepTime: false,
                tags: ['gdev'],
                targetBlank: false,
                title: 'link 2',
                tooltip: '',
                type: 'dashboards',
                url: '',
            },
            {
                asDropdown: false,
                icon: 'external link',
                includeVars: false,
                keepTime: false,
                tags: [],
                targetBlank: false,
                title: '',
                tooltip: '',
                type: 'link',
                url: 'https://www.bing.com',
            },
        ],
    });
}
describe('LinksSettings', () => {
    const getTableBody = () => screen.getAllByRole('rowgroup')[1];
    const getTableBodyRows = () => within(getTableBody()).getAllByRole('row');
    const assertRowHasText = (index, text) => {
        expect(within(getTableBodyRows()[index]).queryByText(text)).toBeInTheDocument();
    };
    test('it renders a header and cta if no links', () => {
        const linklessDashboard = createDashboardModelFixture({ links: [] });
        setup(linklessDashboard);
        expect(screen.getByRole('heading', { name: 'Links' })).toBeInTheDocument();
        expect(screen.getByTestId(selectors.components.CallToActionCard.buttonV2('Add dashboard link'))).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
    test('it renders a table of links', () => {
        const dashboard = buildTestDashboard();
        setup(dashboard);
        expect(getTableBodyRows().length).toBe(dashboard.links.length);
        expect(screen.queryByTestId(selectors.components.CallToActionCard.buttonV2('Add dashboard link'))).not.toBeInTheDocument();
    });
    test('it rearranges the order of dashboard links', () => __awaiter(void 0, void 0, void 0, function* () {
        const dashboard = buildTestDashboard();
        const links = dashboard.links;
        setup(dashboard);
        // Check that we have sorting buttons
        expect(within(getTableBodyRows()[0]).queryByRole('button', { name: 'Move link up' })).not.toBeInTheDocument();
        expect(within(getTableBodyRows()[0]).queryByRole('button', { name: 'Move link down' })).toBeInTheDocument();
        expect(within(getTableBodyRows()[1]).queryByRole('button', { name: 'Move link up' })).toBeInTheDocument();
        expect(within(getTableBodyRows()[1]).queryByRole('button', { name: 'Move link down' })).toBeInTheDocument();
        expect(within(getTableBodyRows()[2]).queryByRole('button', { name: 'Move link up' })).toBeInTheDocument();
        expect(within(getTableBodyRows()[2]).queryByRole('button', { name: 'Move link down' })).not.toBeInTheDocument();
        // Checking the original order
        assertRowHasText(0, links[0].title);
        assertRowHasText(1, links[1].title);
        assertRowHasText(2, links[2].url);
        yield userEvent.click(within(getTableBody()).getAllByRole('button', { name: 'Move link down' })[0]);
        yield userEvent.click(within(getTableBody()).getAllByRole('button', { name: 'Move link down' })[1]);
        yield userEvent.click(within(getTableBody()).getAllByRole('button', { name: 'Move link up' })[0]);
        // Checking if it has changed the sorting accordingly
        assertRowHasText(0, links[2].url);
        assertRowHasText(1, links[1].title);
        assertRowHasText(2, links[0].title);
    }));
    test('it duplicates dashboard links', () => __awaiter(void 0, void 0, void 0, function* () {
        const dashboard = buildTestDashboard();
        setup(dashboard);
        expect(getTableBodyRows().length).toBe(dashboard.links.length);
        yield userEvent.click(within(getTableBody()).getAllByRole('button', { name: /copy/i })[0]);
        expect(getTableBodyRows().length).toBe(4);
        expect(within(getTableBody()).getAllByText(dashboard.links[0].title).length).toBe(2);
    }));
    test('it deletes dashboard links', () => __awaiter(void 0, void 0, void 0, function* () {
        const dashboard = buildTestDashboard();
        const originalLinks = dashboard.links;
        setup(dashboard);
        expect(getTableBodyRows().length).toBe(dashboard.links.length);
        yield userEvent.click(within(getTableBody()).getAllByLabelText(/Delete link with title/)[0]);
        yield userEvent.click(within(getTableBody()).getByRole('button', { name: 'Delete' }));
        expect(getTableBodyRows().length).toBe(2);
        expect(within(getTableBody()).queryByText(originalLinks[0].title)).not.toBeInTheDocument();
    }));
    test('it renders a form which modifies dashboard links', () => __awaiter(void 0, void 0, void 0, function* () {
        const dashboard = buildTestDashboard();
        const originalLinks = dashboard.links;
        setup(dashboard);
        yield userEvent.click(screen.getByRole('button', { name: /new/i }));
        expect(screen.queryByText('Type')).toBeInTheDocument();
        expect(screen.queryByText('Title')).toBeInTheDocument();
        expect(screen.queryByText('With tags')).toBeInTheDocument();
        expect(screen.queryByText('Apply')).toBeInTheDocument();
        expect(screen.queryByText('Url')).not.toBeInTheDocument();
        expect(screen.queryByText('Tooltip')).not.toBeInTheDocument();
        expect(screen.queryByText('Icon')).not.toBeInTheDocument();
        yield userEvent.click(screen.getByText('Dashboards'));
        expect(screen.queryAllByText('Dashboards')).toHaveLength(2);
        expect(screen.queryByText('Link')).toBeVisible();
        yield userEvent.click(screen.getByText('Link'));
        expect(screen.queryByText('URL')).toBeInTheDocument();
        expect(screen.queryByText('Tooltip')).toBeInTheDocument();
        expect(screen.queryByText('Icon')).toBeInTheDocument();
        yield userEvent.clear(screen.getByRole('textbox', { name: /title/i }));
        yield userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'New Dashboard Link');
        yield userEvent.click(screen.getByRole('button', { name: /Apply/i }));
        expect(getTableBodyRows().length).toBe(4);
        expect(within(getTableBody()).queryByText('New Dashboard Link')).toBeInTheDocument();
        yield userEvent.click(screen.getAllByText(dashboard.links[0].type)[0]);
        yield userEvent.clear(screen.getByRole('textbox', { name: /title/i }));
        yield userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'The first dashboard link');
        yield userEvent.click(screen.getByRole('button', { name: /Apply/i }));
        expect(within(getTableBody()).queryByText(originalLinks[0].title)).not.toBeInTheDocument();
        expect(within(getTableBody()).queryByText('The first dashboard link')).toBeInTheDocument();
    }));
});
//# sourceMappingURL=LinksSettings.test.js.map