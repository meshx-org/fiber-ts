/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ['packages/sdk/**/*.ts', 'packages/kernel/**/*.ts', '!**/*.d.ts'],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // A set of global variables that need to be available in all test environments
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '@meshx-org/fiber-sdk(.*)$': '<rootDir>/packages/sdk/src/$1',
        '@meshx-org/fiber-kernel(.*)$': '<rootDir>/packages/kernel/src/$1',
        '@meshx-org/fiber-types(.*)$': '<rootDir>/packages/types/src/$1'
    },

    preset: 'ts-jest',

    // The paths to modules that run some code to configure or set up the testing environment before each test
    // setupFiles: [],

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    // setupFilesAfterEnv: [],

    // The test environment that will be used for testing
    testEnvironment: 'node',

    // Indicates whether each individual test should be reported during the run
    verbose: true
}
