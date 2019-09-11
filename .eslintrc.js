module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es6': true,
		'node': true,
		'amd': true
	},
	'extends': [
		'plugin:@typescript-eslint/eslint-recommended',
		'react-app'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaFeatures': {
			'experimentalObjectRestSpread': true,
			'jsx': true,
			'templateStrings': true,
			'superInFunctions': true,
			'spread': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'react', 
		'react-hooks',
		'@typescript-eslint'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'padded-blocks': ['error', {
			'switches': 'always',
			'classes': 'never',
			'blocks': 'always'
		}],
	}
};