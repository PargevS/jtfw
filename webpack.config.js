const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isPrd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

const formulateFileName = (ext) => {
  return isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        cacheCompression: false,
        // presets: ["@babel/preset-env", "@babel/preset-typescript"],
      },
    },
  ];

  if (isDev) loaders.push("eslint-loader");

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: ["@babel/polyfill", path.resolve(__dirname, "src") + "/index.ts"],
  output: {
    filename: formulateFileName("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/core"),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: "index.html",
      minify: {
        removeComments: isPrd,
        collapseWhitespace: isPrd,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/favicon.ico"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: formulateFileName("css"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  devtool: isDev ? "source-map" : false,
  devServer: {
    port: 3000,
    hot: isDev,
  },
};