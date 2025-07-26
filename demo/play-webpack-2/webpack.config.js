const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
  ],
  devServer: {
    port: 9002,
    static: {
      directory: path.resolve(__dirname, "src")
    },
    host: "local-ip",
  },
  stats: "minimal",
};