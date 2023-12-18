/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function themePalette(theme) {
  const level = theme.customization.colorLevel;
  return {
    primary: {
      light: theme.customization.primaryColor[level],
      main: theme.customization.primaryColor[500],
    },
    secondary: {
      light: theme.customization.secondaryColor[50],
      main: theme.customization.secondaryColor[500],
    },
    text: {
      primary: theme.darkTextPrimary,
      secondary: theme.darkTextSecondary,
    },
    background: {
      paper: theme.paper,
      default: theme.paper,
    },
  };
}
