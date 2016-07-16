module.exports = {
  'extends': 'airbnb',
  parser: 'babel-eslint',
  rules: {
    // Accept assign props for express middleware
    'no-param-reassign': [2, { 'props': false }],
  },
};
