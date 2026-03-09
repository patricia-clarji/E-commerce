const tsParser = require('@typescript-eslint/parser');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.spec.json'],
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
        },
        plugins: {
            '@angular-eslint': angular,
        },
        rules: {
            ...angular.configs.recommended.rules,

            '@angular-eslint/prefer-inject': 'off',
            '@angular-eslint/no-output-native': 'off',
        },
    },
    {
        files: ['src/**/*.html'],
        languageOptions: {
            parser: angularTemplateParser,
        },
        plugins: {
            '@angular-eslint/template': angularTemplate,
        },
        rules: {
            ...angularTemplate.configs.recommended.rules,

            '@angular-eslint/template/prefer-control-flow': 'off',
            '@angular-eslint/template/eqeqeq': 'off',
        },
    },
    prettierConfig,
];