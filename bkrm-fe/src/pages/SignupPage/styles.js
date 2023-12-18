import { makeStyles } from "@material-ui/core/styles";

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
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  button: {
    display: "flex",
    flexDirection: "row",
    align: "center",
    justifyContent: "space-between",
    width: "100%",
    margin: theme.spacing(3, 0, 2),
  },
}));
