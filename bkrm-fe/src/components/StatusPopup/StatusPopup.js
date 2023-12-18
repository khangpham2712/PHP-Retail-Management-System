import { Button, notification, Space } from "antd";

const openNotification = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
    placement: "bottomRight",
    // placement: "topRight",
    // style:{marginTop:60}
    // style:{backgroundColor:'#4BB04F',  fontWeight:500}

  });
};
export default openNotification;
