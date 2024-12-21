const fs = require('fs');
const path = require('path');

const vcxprojPath = path.join(
  __dirname,
  '../node_modules/react-native-track-player/windows/RNTrackPlayer/RNTrackPlayer.vcxproj'
);

fs.readFile(vcxprojPath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading ${vcxprojPath}:`, err);
    return;
  }

  const fixedData = data.replace(
    /<WindowsTargetPlatformMinVersion>.*<\/WindowsTargetPlatformMinVersion>/,
    '<WindowsTargetPlatformMinVersion>10.0.17763.0</WindowsTargetPlatformMinVersion>'
  );

  fs.writeFile(vcxprojPath, fixedData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing ${vcxprojPath}:`, err);
    } else {
      console.log('Updated WindowsTargetPlatformMinVersion in RNTrackPlayer.vcxproj.');
    }
  });
});
