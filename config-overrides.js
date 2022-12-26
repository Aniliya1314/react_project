const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  addWebpackModuleRule,
} = require("customize-cra");
const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = override(
  addDecoratorsLegacy(),
  addWebpackModuleRule({
    test: [/\.css$/, /\.less$/],
    use: [
      "style-loader",
      "css-loader",
      "postcss-loader",
      { loader: "less-loader" },
    ],
  }),
  addWebpackAlias({
    ["@"]: resolve("src"),
  })
);
