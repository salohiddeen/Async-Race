module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'max-lines-per-function': ['warn', { max: 40 }],
    'no-magic-numbers': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-param-reassign': ['error', { props: false }],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'no-nested-ternary': 'off',
    'max-len': ['warn', { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'react/button-has-type': 'off',
  },
  overrides: [
    {
      // Redux Toolkit reducers use Immer, so "mutating" state is safe and idiomatic.
      files: ['src/store/slices/*.ts'],
      rules: {
        'no-param-reassign': 'off',
      },
    },
  ],
};
