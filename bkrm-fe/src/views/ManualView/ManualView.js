import { Card } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useStyles from "../../components/TableCommon/style/mainViewStyle";
const ManualView = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Card className={classes.root}>
            <iframe width={'100%'} style={{height: '90vh'}}src="https://docs.google.com/document/d/e/2PACX-1vQ8n2RDFUBi5P-fYr75j_0ASFkw2FbvRvVpqH039v_9PDbV92EGRCmDDOtsSJ4azw6rrgGalKnbRmtE/pub?embedded=true"></iframe>
        </Card>
    )
}

export default ManualView;