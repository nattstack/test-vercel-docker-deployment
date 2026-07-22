import { defineConfig } from "oxfmt"

export default defineConfig({
  $schema: "./node_modules/oxfmt/configuration_schema.json",
  experimentalSortImports: {
    newlinesBetween: false,
  },
  experimentalSortPackageJson: {
    sortScripts: true,
  },
  ignorePatterns: ["src/db/migrations", "src/routeTree.gen.ts"],
  semi: false,
})
