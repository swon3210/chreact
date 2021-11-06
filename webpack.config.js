const path = require("path");

const mode =
  process.env.NODE_ENV === "production" ? process.env.NODE_ENV : "development";

module.exports = {
  mode,
  entry: "./lib/index.ts",
  output: {
    path: __dirname,
    filename: "index.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
