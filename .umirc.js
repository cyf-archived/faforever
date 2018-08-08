export default {
  outputPath: './src/dist',
  hashHistory: true,
  disableServiceWorker: true,
  plugins: [
    ['umi-plugin-routes', {
      exclude: [
        /components/,
      ],
    }],
  ]
};
