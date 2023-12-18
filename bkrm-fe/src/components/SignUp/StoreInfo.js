import {
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@material-ui/core";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
const StoreInfo = (props) => {
  const { store_formik,cityList,districtList,wardList } = {
    ...props,
  };
  return (
    <React.Fragment>
      <Grid container spacing={2} style={{ maxWidth: 600, marginTop: 10 }}>
        <Grid item xs={12}>
          <TextField
            name="name"
            variant="outlined"
            required
            fullWidth
            label="Tên cửa hàng"
            onChange={store_formik.handleChange}
            value={store_formik.values.name}
            error={store_formik.touched.name && store_formik.errors.name}
            helperText={store_formik.touched.name ? store_formik.errors.name : null}
            onBlur={store_formik.handleBlur}
          />
        </Grid>
        {/* <Grid item xs={5}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Số điện thoại"
            name="phone"
            onChange={store_formik.handleChange}
            value={store_formik.values.phone}
            error={store_formik.touched.phone && store_formik.errors.phone}
            helperText={store_formik.touched.phone ? store_formik.errors.phone : null}
            onBlur={store_formik.handleBlur}
          />
        </Grid> */}
        <Grid item xs={12}>
          <FormControl
            required
            fullWidth
            variant="outlined"
            error={store_formik.touched.city && store_formik.errors.city}
          >
            <InputLabel>Tỉnh</InputLabel>
            <Select
              native
              name="city"
              label="Tỉnh"
              value={store_formik.values.city}
              onChange={store_formik.handleChange}
              onBlur={store_formik.handleBlur}
            >
              <option value="" />
              {cityList.map((city) => (
                <option value={city.id}>{city.name}</option>
              ))}
            </Select>
            {store_formik.touched.city ? (
              <FormHelperText>{store_formik.errors.city}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            required
            fullWidth
            variant="outlined"
            error={store_formik.touched.district && store_formik.errors.district}
          >
            <InputLabel>Huyện</InputLabel>
            <Select
              native
              label="Huyện"
              name="district"
              value={store_formik.values.district}
              onChange={store_formik.handleChange}
              onBlur={store_formik.handleBlur}
            >
              <option value="" />
              {districtList.map((district) => (
                <option value={district.id}>{district.name}</option>
              ))}
            </Select>
            {store_formik.touched.district ? (
              <FormHelperText>{store_formik.errors.district}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            required
            fullWidth
            variant="outlined"
            error={store_formik.touched.ward && store_formik.errors.ward}
          >
            <InputLabel htmlFor="ward">Xã</InputLabel>
            <Select
              native
              label="Xã"
              name="ward"
              value={store_formik.values.ward}
              onChange={store_formik.handleChange}
              onBlur={store_formik.handleBlur}
            >
              <option aria-label="None" value="" />
              {wardList.map((ward) => (
                <option value={ward.id}>{ward.name}</option>
              ))}
            </Select>
            {store_formik.touched.ward ? (
              <FormHelperText>{store_formik.errors.ward}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="address"
            variant="outlined"
            required
            fullWidth
            label="Địa chỉ"
            onChange={store_formik.handleChange}
            value={store_formik.values.address}
            onBlur={store_formik.handleBlur}
            error={store_formik.touched.address && store_formik.errors.address}
            helperText={store_formik.touched.address ? store_formik.errors.address : null}
          />
        </Grid>
      </Grid>{" "}
    </React.Fragment>
  );
};

export default StoreInfo;
