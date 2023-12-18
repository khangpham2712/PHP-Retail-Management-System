import { makeStyles } from "@material-ui/core";
export default makeStyles((theme) => ({
  background: {
    padding: 20,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background:
      theme.customization.mode === "Light"
        ? theme.palette.primary.light
        : theme.customization.primaryColor[theme.customization.colorLevel],
  },
  container: {
    background: theme.palette.background.default,
    minHeight: "90vh",
   width: 400,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
