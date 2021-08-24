const errorAtProduction = process.env.NODE_ENV === "production" ? "error" : "warn";

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
    // 프로덕션 시 console.log가 있으면 에러 발생, 개발 시에는 경고 발생
    "no-console": errorAtProduction,
    "no-unused-vars": errorAtProduction,
    "prefer-const": errorAtProduction,
  },
};
