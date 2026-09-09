module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo already injects the Reanimated/Worklets babel plugin when
    // react-native-reanimated is installed (see babel-preset-expo/build/index.js).
    // Listing it again here applies it twice and breaks worklet compilation.
    presets: ['babel-preset-expo'],
  };
};
