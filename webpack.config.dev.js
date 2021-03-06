const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  // debug: true,
  devtool: "cheap-module-eval-source-map",
  // noInfo: false,
  // entry: [
  //   "eventsource-polyfill", // necessary for hot reloading with IE
  //   "webpack-hot-middleware/client?reload=true", //note that it reloads the page if hot module reloading fails.
  //   "./src/index"
  // ],
  target: "web",
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false
  },
  entry: {
    app: [
      // "eventsource-polyfill", // necessary for hot reloading with IE
      "webpack-hot-middleware/client?reload=true", //note that it reloads the page if hot module reloading fails.
      "./src/index"
    ]
  },
  output: {
    path: __dirname + "/dist", // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./src"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: "bundle.css",
      allChunks: false
    }),
  ],
  module: {
    rules: [
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract({
          include: [
            /node_modules\/react-toolbox/,
          ],
          fallbackLoader: "style-loader",
          loader: [
            "css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
            "sass-loader"
          ]
        })
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        loader: "babel-loader",
        query: {
          cacheDirectory: true,
          presets: [
            "react",
            ["es2015", {"modules": false}],
            "stage-0"
          ]
        },
        exclude: /node_modules/
      },
      // {test: /(styles.css)$/, loaders: ["style-loader", "css-loader"]},
      // {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      // {test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000"},
      {test: /\.ico$/, loader: "file-loader?name=[name].[ext]"},
      {test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: "file-loader?name=fonts/[name]__[hash].[ext]"},
      // {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      // {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"},
      // {
      //   test: /.*\.(gif|png|jpe?g|svg)$/i,
      //   loaders: [
      //     "file-loader",
      //     {
      //       loader: "image-webpack-loader",
      //       query: {
      //         progressive: true,
      //         optimizationLevel: 7,
      //         interlaced: false,
      //         pngquant: {
      //           quality: "65-90",
      //           speed: 4
      //         }
      //       }
      //     }
      //   ]
      // }
    ]
  }
};
