const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.resolverMainFields = ["react-native", "browser", "main"];

module.exports = withUniwindConfig(config, {
    cssEntryFile: "./src/global.css",
});
