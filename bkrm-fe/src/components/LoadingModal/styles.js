import { makeStyles } from "@material-ui/styles";
export default makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    minWidth: "100%",
    minHeight: "100vh",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: "100vw",
    minHeight: "100vh",
  },
  box: {
    width: "100%",
  },
  btn: {
    marginTop: -9,
    marginRight: -3,
  },
  loading: {
    maxWidth: 100,
  },
}));
