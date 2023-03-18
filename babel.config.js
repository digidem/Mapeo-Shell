module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // react-native-reanimated/plugin has to be last
    plugins: ["react-native-reanimated/plugin"],
  };
};
