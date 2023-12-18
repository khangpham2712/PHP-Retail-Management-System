import { Button } from "@material-ui/core";
import React from "react";
import axiosClient from "../../api/axiosClient";

const Test = () => {
  let url =
    "https://cdn.shopify.com/s/files/1/0234/8017/2591/products/young-man-in-bright-fashion_925x_f7029e2b-80f0-4a40-a87b-834b9a283c39.jpg";
  const test = async () => {
    try {
      fetch(url).then((response) => console.log(response));
    } catch (error) {
      console.log(error);
    }
  };
  return <Button onClick={test}>Trye</Button>;
};

export default Test;
