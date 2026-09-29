module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.LEXICON_GITHUB_PAGES === '1' ? { baseUrl: '/lexicon' } : {}),
  },
});
