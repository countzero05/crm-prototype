import webpack from "webpack";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";

const GLOBALS = {
  "process.env.NODE_ENV": JSON.stringify("production")
};

export default {
  resolve: {
    alias: {
      "react": "react-lite",
      "react-dom": "react-lite"
    }
  },
  // debug: true,
  devtool: "source-map",
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
    // new ExtractTextPlugin("styles.css"),
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      minimize: true,
      sourceMap: false,
      debug: false,
      mangle: true
    }),
    new ExtractTextPlugin({
      filename: "style.css",
      allChunks: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/, include: path.join(__dirname, "src"), loader: "babel-loader",
        query: {
          presets: ["react", ["env", {
            "targets": {
              "browsers": ["last 3 versions"]
            }
          }], "stage-0"]
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
      {test: /\.ico$/, loader: "file-loader?name=[name].[ext]"},
      {test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: "file-loader?name=fonts/[name].[ext]"},
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
