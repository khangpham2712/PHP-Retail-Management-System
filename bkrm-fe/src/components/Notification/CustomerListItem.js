import {
  Typography,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@material-ui/core";
import DraftsIcon from "@mui/icons-material/Drafts";
import storeApi from "../../api/storeApi";
import CustomerDebtEmail from "../Email/CustomerDebtEmail";
import { useSelector } from "react-redux";
import { statusAction } from "../../store/slice/statusSlice";
const CustomerListItem = ({ customer }) => {
    const info = useSelector(state => state.info)
    const sendEmail = async () => {
        const emailRes = await storeApi.sendEmail(
            info.store.uuid, customer.email, customer.name, "Email đến hạn thanh toán", CustomerDebtEmail("", "", customer, info.store) );
        statusAction.successfulStatus('Đã gửi email thành công')
    }
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemIcon>
          <Tooltip title="Gửi email nhắc nợ">
            <DraftsIcon onClick={sendEmail} />
          </Tooltip>
        </ListItemIcon>
        <ListItemText
          primary={customer.name}
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {`${customer.phone} ${
                  customer.email ? "-" + customer.email : ""
                }` + " - "}
                <strong
                  style={{ color: "red" }}
                >{`Công nợ: ${customer.total_debt}`}</strong>
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};
export default CustomerListItem;
