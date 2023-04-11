module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // react-native-reanimated needs to be listed last
    // https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
    plugins: ["react-native-reanimated/plugin"],
  };
};
