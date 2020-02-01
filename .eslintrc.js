module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:import/errors',
        'plugin:import/typescript'
    ],
    rules: {
        '@typescript-eslint/no-object-literal-type-assertion': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        'import/order': ['error', {'newlines-between': 'always'}],
        "quotes": [2, "single", { "avoidEscape": true }],
        'import/export': 2,
        'import/first': 2,
        'import/newline-after-import': 2,
        'import/exports-last': 2,
        'import/named': 0,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
};
