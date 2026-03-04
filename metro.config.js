const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('glb', 'gltf', 'png', 'jpg');
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => !config.resolver.sourceExts.includes(ext)
);

module.exports = config;
