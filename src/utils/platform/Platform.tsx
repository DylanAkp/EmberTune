import {Platform} from 'react-native';

const isWindows = Platform.OS === 'windows';
const isMac = Platform.OS === 'macos';
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

export const isMobile = () => isAndroid || isIOS;
export const isDesktop = () => isWindows || isMac;
