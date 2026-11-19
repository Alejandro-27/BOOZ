/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // Deja el formateo en manos de Prettier
    "prettier",
  ],
  ignorePatterns: [
    "node_modules",
    "dist",
    ".next",
    ".turbo",
    "pnpm-lock.yaml",
    // Generado por Next; usa triple-slash reference por diseño
    "next-env.d.ts",
  ],
  rules: {
    // Obliga a usar `import type` para imports que solo aportan tipos
    "@typescript-eslint/consistent-type-imports": "warn",
    // Permite parámetros sin usar con prefijo `_`
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
