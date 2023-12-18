import { makeStyles } from "@material-ui/core";
export default makeStyles((theme) => ({
  margin: {
    marginTop: theme.spacing(2),
  },
  headerTitle: {
    fontSize: "1.125rem",
  },
  root: {
    padding: 20,
  },
  box: {
    display: "flex",
    alignItems: "center",
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  attrCard:{
    margin:"5px 0px 25px 0px", 
    boxShadow: "none",border: '1px solid' , borderColor:"#c9c9c9"
  },
  attrHead:{
    backgroundColor:"#E4E4E4", height:40, color:"#000"
  },
  rooot: {
    '& .MuiFormLabel-root.Mui-disabled': {
      color: 'red',
    },
  },
}));
