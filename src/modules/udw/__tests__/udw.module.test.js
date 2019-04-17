import React from 'react';
import { render, cleanup } from 'react-testing-library';
import UDWModule from '../udw.module';

const TestComponent = () => {
    return <div />;
};

afterEach(cleanup);

describe('UDWModule rendering', () => {
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
            restInfo: {
                token: 'token',
                siteaccess: 'pol-PL',
            },
            tabs: [
                {
                    id: 'test',
                    title: tabTitle,
                    panel: TestComponent,
                    attrs: {},
                },
            ],
        };
        const { getByTestId } = render(<UDWModule {...attrs} />);

        expect(getByTestId('udw-tabs')).toBeDefined();
        expect(getByTestId('udw-panels')).toBeDefined();

        expect(global.eZ.addConfig).toBeCalled();
    });
});
