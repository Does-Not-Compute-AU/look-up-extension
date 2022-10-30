/**
 * @type {import('prettier').Options}
 */
module.exports = {
  printWidth: 180,
  tabWidth: 4,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: true,
  plugins: [require.resolve("@plasmohq/prettier-plugin-sort-imports")],
  importOrder: ["^~(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
