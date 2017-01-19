const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const GLOBALS = {
  "process.env.NODE_ENV": JSON.stringify("production")
};

module.exports = {
  resolve: {
    alias: {
      "react": "react-lite",
      "react-dom": "react-lite",
    }
  },
  // debug: true,
  devtool: "hidden-source-map",
  // noInfo: false,
  entry: [
    "./src/index"
  ],
  target: "web",
  output: {
    path: __dirname + "/dist", // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      },
    }),
    new ExtractTextPlugin({
      filename: "bundle.css",
      allChunks: false
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.join(__dirname, "src"), path.join(__dirname, "node_modules/date_format")],
        loader: "babel-loader",
        query: {
          presets: [
            ["es2015", {"modules": false}],
            "stage-0",
            "react",
          ]
        },
        exclude: /node_modules/
      },
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: [
            "css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
            "sass-loader"
          ]
        })
      },
      // {test: /(\.css)$/, loader: ExtractTextPlugin.extract("css-loader?sourceMap")},
      // {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      // {test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000"},
      // {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
      // {test: /\.png$/, loader: "url-loader?name=[name]__[hash].[ext]"},
      // {test: /\.ico$/, loader: "file-loader?name=[name]__[hash].[ext]"},
      {test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: "file-loader?name=fonts/[name]__[hash].[ext]"},
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
