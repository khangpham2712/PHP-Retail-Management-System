import { Typography, ListItem, ListItemText, Divider, ListItemAvatar, Avatar } from "@material-ui/core";

const OutOfDateListItem = ({ product }) => {
  return (
    <>
      <ListItem alignItems="flex-start">
      <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={JSON.parse(product.img_urls).at(0)} />
        </ListItemAvatar>
        <ListItemText
          primary={`${product.name} - Lô: ${product.batch_code}`}
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="red"
              >
                <strong>{`Hạn: ${product.expiry_date.substring(0, 10)}`}</strong>
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};
export default OutOfDateListItem