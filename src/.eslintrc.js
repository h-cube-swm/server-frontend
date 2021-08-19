module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb-base",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "prefer-template": "off",
    "no-shadow": "off",
    "react/prop-types": "off",
    "no-plusplus": "off",
    "react/display-name": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
