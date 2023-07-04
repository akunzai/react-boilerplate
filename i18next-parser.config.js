// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: ['src/**/*.tsx'],
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  locales: ['zh-Hant'],
  sort: true,
};
