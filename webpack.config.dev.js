const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyPlugin = require ('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const {BundlerAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/index.js', //punto de entrada de la app
  output: {
    path: path.resolve(__dirname, 'dist'), // para ubicar la carpeta de este repositorio
    filename: '[name].[contenthash].js', //El nombre del js resultante,

  },//lo que va devolver el bundle
  resolve: {
      extensions: ['.js'], // el tipo de archivos con el que se va a trabajar.
      alias: { //Podemos utilizar ALIAS para obtener parte del path de nuestro proyecto
        '@utils': path.resolve(__dirname, 'src/utils/'),
        '@templates': path.resolve(__dirname, 'src/templates/'),
        '@styles': path.resolve(__dirname, 'src/styles/'),
        '@images': path.resolve(__dirname, 'src/assets/images/')
      }
  },
  //Reglas para indicarle a webpack con que va a trabajar
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules:[ // en este arreglo, se agregan objetos para ir trabajando con modulos en webpack
      {
        test: /\.m?js$/, //que tipo de archivos vamos a trabajar, se indica con regex
        exclude: /node_modules/, //que tipo de archivos NO VA A UTILIZAR
        use: {
          loader: 'babel-loader' //el loader que utilizara para utilizar la config de .babelrc
        }
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
        ],
      },
      {
        test: /\.png/,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[contenthash][ext][query]',  // Directorio de salida
        },

      },
      {
        test: /\.(woff|woff2)$/i,  // Tipos de fuentes a incluir
        type: 'asset/resource',  // Tipo de módulo a usar (este mismo puede ser usado para archivos de imágenes)
        generator: {
          filename: 'static/fonts/[contenthash][ext][query]',  // Directorio de salida
        },
      },

    ]
  },//Los plugins que se van a utilzar
  plugins: [
    new HtmlWebpackPlugin({ //Configuracion para el plugin html
      inject: true,
      template: './public/index.html', //indica que archivo inicial va a tomar.
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    new copyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets/images'), //indicar la carpeta a llevarse,
          to: 'assets/images'
        }
      ]
    }),
    new Dotenv(),
    new BundlerAnalyzerPlugin()
  ],
  devServer:{
    contentBase: path.join(__dirname,'dist'), // saber desde donde ejecutarse
    compress: true, //si desea comprimir
    historyApiFallback: true, //que guarde el historial
    port: 3000 // en que puerto iniciar
  }
}