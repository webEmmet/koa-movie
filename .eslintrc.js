module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "commonjs": false,
    "es6": true,
    "amd": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },
  "plugins": ["import"],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "no-console": ["error", {
      "allow": ["warn", "error", "info"]
    }]
  }
};