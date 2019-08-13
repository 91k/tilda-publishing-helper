module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-multi-spaces": "error",
        "no-whitespace-before-property": "error",
        "camelcase": "error",
        "new-cap": "error",
        "no-console": "error",
        "comma-dangle": "error",
        "no-var": "error",
        "indent": ["error", 2, {"SwitchCase": 1}],
        "semi": [
            "error",
            "always"
        ]
    }
};