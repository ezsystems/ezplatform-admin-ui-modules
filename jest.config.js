module.exports = {
    verbose: false,
    testMatch: [
        '**/src/modules/udw/__tests__/**/*.[jt]s?(x)',
        '**/src/modules/udw/?(*.)+(spec|test).[jt]s?(x)',
        '**/src/modules/common/**/__tests__/**/*.[jt]s?(x)',
        '**/src/modules/common/**/?(*.)+(spec|test).[jt]s?(x)',
    ],
    setupFiles: ['./jest.setup.js'],
};
