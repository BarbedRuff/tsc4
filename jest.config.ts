import type { Config } from 'jest';

const config: Config = {
    maxWorkers: 1,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
