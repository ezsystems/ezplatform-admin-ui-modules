import React from 'react';
import { render, cleanup } from 'react-testing-library';
import UDWModule from '../udw.module';

const TestBasicComponent = () => {
    return <div />;
};

const TestComponentWithAttrs = ({ label }) => {
    return <div>{label}</div>;
};

const basicModuleConfig = {
    restInfo: {
        token: 'token',
        siteaccess: 'pol-PL',
    },
};

afterEach(cleanup);

describe('UDWModule component rendering', () => {
    test('The UDW module renders correctly with information about no tabs being provided', () => {
        const { queryByTestId, getByText } = render(<UDWModule />);

        expect(queryByTestId('udw-tabs')).toBeFalsy();
        expect(queryByTestId('udw-panels')).toBeFalsy();
        expect(getByText(/Nothing to display. There are no tabs defined./i)).toBeTruthy();

        expect(global.eZ.addConfig).toBeCalled();
    });

    test('The UDW module renders correctly with tabs', () => {
        const tabTitle = 'Test';
        const attrs = {
            ...basicModuleConfig,
            tabs: [
                {
                    id: 'test',
                    title: tabTitle,
                    panel: TestBasicComponent,
                    attrs: {},
                },
            ],
        };
        const { getByTestId, getByText } = render(<UDWModule {...attrs} />);
        const tabTitleRegex = new RegExp(tabTitle, 'i');

        expect(getByTestId('udw-tabs')).toBeDefined();
        expect(getByTestId('udw-panels')).toBeDefined();
        expect(getByText(tabTitleRegex)).toBeDefined();

        expect(global.eZ.addConfig).toBeCalled();
    });
});

describe('UDWModule: Passing props to tabs', () => {
    test('The UDW module passes tab props when initializing', () => {
        const componentLabel = 'Component label';
        const attrs = {
            ...basicModuleConfig,
            tabs: [
                {
                    id: 'test',
                    title: 'Tab with props',
                    panel: TestComponentWithAttrs,
                    attrs: { label: componentLabel },
                    active: true,
                },
            ],
        };
        const { getByText } = render(<UDWModule {...attrs} />);
        const labelRegex = new RegExp(componentLabel, 'i');

        expect(getByText(labelRegex)).toBeDefined();
        expect(global.eZ.addConfig).toBeCalled();
    });
});
