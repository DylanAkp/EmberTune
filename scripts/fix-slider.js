// https://github.com/callstack/react-native-slider/issues/618
// Fix for react-native-slider issue on Windows
// Can be removed once the issue is fixed : https://github.com/callstack/react-native-slider/pull/672

const fs = require('fs');
const path = require('path');
const vcxprojPath = path.join(
  __dirname,
  '../node_modules/@react-native-community/slider/windows/SliderWindows/SliderWindows.vcxproj',
);
fs.readFile(vcxprojPath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading ${vcxprojPath}:`, err);
    return;
  }
  const fixedData = data.replace(
    /<WindowsTargetPlatformMinVersion>.*<\/WindowsTargetPlatformMinVersion>/,
    '<WindowsTargetPlatformMinVersion>10.0.17763.0</WindowsTargetPlatformMinVersion>',
  );
  fs.writeFile(vcxprojPath, fixedData, 'utf8', err => {
    if (err) {
      console.error(`Error writing ${vcxprojPath}:`, err);
    } else {
      console.log(
        'Updated WindowsTargetPlatformMinVersion in RNTrackPlayer.vcxproj.',
      );
    }
  });
});
