/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#1A6C30'
const tintColorDark = '#fff'

export const Colors = {
  light: {
    text: '#1A1C19',
    background: '#FCFDF7',
    tint: tintColorLight,
    icon: '#4D5E4A', // Color de icono ajustado
    tabIconDefault: '#4D5E4A', // Color de icono por defecto ajustado
    tabIconSelected: tintColorLight
  },
  dark: {
    text: '#E2E3DD',
    background: '#1A1C19',
    tint: tintColorDark,
    icon: '#7A8F7B', // Color de icono ajustado
    tabIconDefault: '#7A8F7B', // Color de icono por defecto ajustado
    tabIconSelected: tintColorDark
  }
}
