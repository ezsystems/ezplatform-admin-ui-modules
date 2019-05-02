import { classnames } from '../classnames';

describe('The `classnames` helper', () => {
    test('Returns concatenated CSS class names as a string', () => {
        const firstClass = '.first-class';
        const secondClass = '.second-class';
        const expectedOutput = `${firstClass} ${secondClass}`;
        const actualOutput = classnames({
            [firstClass]: true,
            [secondClass]: true,
        });

        expect(actualOutput).toEqual(expectedOutput);
    });

    test('Returns concatenated CSS class names as a string based on provided conditionals', () => {
        const firstClass = '.first-class';
        const secondClass = '.second-class';
        const expectedOutput = `${firstClass}`;
        const actualOutput = classnames({
            [firstClass]: true,
            [secondClass]: false,
        });

        expect(actualOutput).toEqual(expectedOutput);
    });

    test('Returns empty string when a config has incorrect format', () => {
        const firstClass = '.first-class';
        const secondClass = '.second-class';
        const expectedOutput = '';
        const actualOutput = classnames([firstClass, true], [secondClass, true]);

        expect(actualOutput).toEqual(expectedOutput);
    });
});
