import { createTheme } from "@material-ui/core/styles";
// assets
import colors from "../assets/scss/_themes-vars.module.scss";

//project import
import themeTypography from "./typography";
import themePalette from "./palette";

export function theme(customization) {
  const color = colors;

  const themeOption = {
    colors: color,
    heading: customization.themeText,
    paper: customization.themeBackground,
    darkTextPrimary: customization.themeGreyText,
    customization,
  };
  return createTheme({
    customization: customization,
    palette: themePalette(themeOption),
    typography: themeTypography(themeOption),
    mixins: {
      toolbar: {
        minHeight: "48px",
        padding: "16px",
        "@media (min-width: 600px)": {
          minHeight: "48px",
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        // xl: 1920,
        xl: 1500,
      },
    },
  });
}

export default theme;
