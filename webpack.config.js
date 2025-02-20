module.exports = {
  // ...existing code...
  module: {
    rules: [
      // ...existing rules...
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules\/firebase/
      }
    ]
  },
  // ...existing code...
  ignoreWarnings: [/Failed to parse source map/]
};
