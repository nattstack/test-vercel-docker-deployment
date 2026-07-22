import { defineConfig } from "oxlint"

export default defineConfig({
  $schema: "./node_modules/oxlint/configuration_schema.json",
  categories: {
    correctness: "error",
    nursery: "error",
    pedantic: "error",
    perf: "error",
    restriction: "error",
    style: "error",
    suspicious: "error",
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {},
  ignorePatterns: ["src/db/migrations", "src/routeTree.gen.ts"],
  jsPlugins: [
    {
      name: "better-tailwindcss",
      specifier: "eslint-plugin-better-tailwindcss",
    },
    {
      name: "perfectionist",
      specifier: "eslint-plugin-perfectionist",
    },
  ],
  plugins: [
    "eslint",
    "jsdoc",
    "jsx-a11y",
    "oxc",
    "promise",
    "react-perf",
    "react",
    "typescript",
    "unicorn",
  ],
  rules: {
    "better-tailwindcss/enforce-consistent-class-order": "error",
    "better-tailwindcss/enforce-consistent-line-wrapping": ["error", { strictness: "loose" }],
    "better-tailwindcss/no-unnecessary-whitespace": "error",
    "eslint/capitalized-comments": "allow", // Allow capitalized comments
    "eslint/func-name-matching": "allow", // Allow function name matching
    "eslint/func-style": ["error", "declaration"], // Prefer function declarations over function expressions
    "eslint/id-length": ["error", { exceptions: ["_", "x", "y", "z"] }], // Allow `_` for unused parameters
    "eslint/max-lines": "allow", // Allow long files
    "eslint/max-lines-per-function": "allow", // Allow long functions
    "eslint/max-statements": "allow", // Allow large number of statements
    "eslint/no-console": "allow", // Don't mind `console.log()`
    "eslint/no-inline-comments": "allow", // Able to sort object keys and keep comments
    "eslint/no-magic-numbers": ["error", { ignore: [0, 1] }], // Allow `0` and `1` for magic numbers
    "eslint/no-shadow": "allow", // Allow same variable name in different scopes
    "eslint/no-ternary": "allow", // Allow ternary operators
    "eslint/no-undefined": "allow", // Conflicts with unicorn/no-null
    "eslint/no-unused-vars": ["error", { fix: { imports: "safe-fix" } }], // Prune unused imports
    "eslint/no-use-before-define": "allow",
    "eslint/no-warning-comments": "allow", // Don't mind `TODO:` comments
    "eslint/sort-imports": "allow", // Conflicts with oxfmt
    "jsdoc/require-param-type": "allow", // Types live in TypeScript signatures
    "jsdoc/require-returns-type": "allow", // Types live in TypeScript signatures
    "jsx-a11y/no-autofocus": "allow", // Allow autofocus for input fields
    "oxc/no-async-await": "allow",
    "oxc/no-optional-chaining": "allow",
    "oxc/no-rest-spread-properties": "allow", // Allow rest spread properties for object destructuring
    "perfectionist/sort-array-includes": "error",
    "perfectionist/sort-classes": "error",
    "perfectionist/sort-decorators": "error",
    "perfectionist/sort-enums": "error",
    "perfectionist/sort-export-attributes": "error",
    "perfectionist/sort-exports": "error",
    "perfectionist/sort-heritage-clauses": "error",
    "perfectionist/sort-interfaces": "error",
    "perfectionist/sort-intersection-types": "error",
    "perfectionist/sort-jsx-props": "error",
    "perfectionist/sort-maps": "error",
    "perfectionist/sort-modules": "error",
    "perfectionist/sort-named-exports": "error",
    "perfectionist/sort-object-types": "error",
    "perfectionist/sort-sets": "error",
    "perfectionist/sort-switch-case": "error",
    "perfectionist/sort-union-types": "error",
    "perfectionist/sort-variable-declarations": "error",
    "react-perf/jsx-no-jsx-as-prop": "allow", // Allow jsx as prop for react components
    "react-perf/jsx-no-new-function-as-prop": "allow",
    "react-perf/jsx-no-new-object-as-prop": "allow", // Allow new object as prop for react components
    "react/forbid-component-props": "allow", // Allow className prop
    "react/jsx-filename-extension": "allow",
    "react/jsx-max-depth": "allow",
    "react/jsx-no-literals": "allow", // Allow string literals in JSX
    "react/jsx-no-useless-fragment": "allow", // Allow empty fragments (for return type JSX.Element)
    "react/jsx-props-no-spreading": "allow", // Allow spreading props for react components
    "react/no-array-index-key": "allow", // Allow array index for react keys
    "react/no-multi-comp": "allow",
    "react/react-compiler": "allow", // Allows `setState` in useEffect
    "react/react-in-jsx-scope": "allow",
    "typescript/no-empty-interface": ["error", { allowSingleExtends: true }], // Allow types to be extensible
    "typescript/no-empty-object-type": ["error", { allowWithName: "Props$" }], // Allow types to be extensible
  },
  settings: {
    "better-tailwindcss": {
      entryPoint: "src/styles/global.css",
    },
  },
})
