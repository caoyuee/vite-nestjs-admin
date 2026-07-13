const path = require('path');
const webpack = require('webpack');

const ignoredOptionalModules = new Set([
  '@fastify/static',
  '@google-cloud/spanner',
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets',
  '@nestjs/websockets/socket-module',
  '@sap/hana-client',
  '@sap/hana-client/extension/Stream',
  'better-sqlite3',
  'cache-manager',
  'mongodb',
  'mssql',
  'mysql',
  'oracledb',
  'pg',
  'pg-native',
  'pg-query-stream',
  'react-native-sqlite-storage',
  'redis',
  'sql.js',
  'sqlite3',
  'typeorm-aurora-data-api-driver',
]);

/**
 * NestJS 后端 bundle 构建配置
 *
 * @description
 * 该配置用于把后端入口和大部分运行依赖打包到 dist-bundle/main.js。
 * Node.js 内置模块会由运行时提供，不会被打进 bundle。
 */
module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/main.ts',
  devtool: 'source-map',
  externalsPresets: {
    node: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist-bundle'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      // @nestjs/swagger 依赖该历史路径，webpack 在 package exports 下需要明确指向。
      'class-transformer/storage': require.resolve('class-transformer/cjs/storage'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.build.json'),
          transpileOnly: true,
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        // NestJS 和 TypeORM 会动态探测多种可选平台/数据库驱动；当前项目未使用，bundle 时忽略即可。
        return ignoredOptionalModules.has(resource);
      },
    }),
  ],
};
