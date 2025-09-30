import path from 'path';
import TerserPlugin from "terser-webpack-plugin";

export default (env, argv) => {
  const dev = argv.mode === 'development';
  return {
    mode: argv.mode,
    entry: './src/script/script.js',
    output: {
      filename: 'index.js',
      path: path.resolve(process.cwd(), 'dist/script'),
      // sourcemaps будем складывать в dist/maps (только для dev разработки)
      sourceMapFilename: path.join("..", "maps", "[file].map"),
    },
    devtool: dev ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env', {
                    useBuiltIns: 'usage',
                    corejs: 3,  // обязательно указываем версию
                  }
                ]
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: !dev,
      minimizer: [
        new TerserPlugin({
          extractComments: false, // 🚫 не выносить комментарии в отдельный файл
        }),
      ],
    },
  };
}
