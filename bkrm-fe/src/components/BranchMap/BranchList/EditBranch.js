import {
  Box,
  Button,
  createStyles,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import branchApi from "../../../api/branchApi";
import userApi from "../../../api/userApi";
import { statusAction } from "../../../store/slice/statusSlice";
import SimpleModal from "../../Modal/ModalWrapper";
import getGeoCode from "../Geocode";
import ConfirmPopUp from "../../ConfirmPopUp/ConfirmPopUp";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import avaUpload from "../../../assets/img/product/default-product.png";
import * as Yup from "yup";
import { infoActions } from "../../../store/slice/infoSlice";

const useStyles = makeStyles((theme) =>
  createStyles({
    headerTitle: {
      fontSize: "1.125rem",
    },
  })
);
const UploadImages = (img) => {
  return (
    <Box
      component="img"
      sx={{
        height: 70,
        width: 70,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 2,
      }}
      src={avaUpload}
    />
  );
};
const EditBranch = (props) => {
  const { handleClose, open, branch } = props;
  const classes = useStyles();

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [image, setImage] = useState([]);
  const [display, setDisplay] = useState([]);
  const clearImage = () => {
    setDisplay([]);
    setImage([]);
  };
  const addImageHandler = (e) => {
    setImage(e.target.files[0]);
    setDisplay(URL.createObjectURL(e.target.files[0]));
  };
  useEffect(() => {
    if (branch.img_url) {
      setDisplay(branch.img_url);
      setImage(branch.img_url);
    }
  }, [branch]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: branch.name,
      address: branch.address,
      ward: branch.ward,
      district: branch.district,
      city: branch.province,
      phone: branch.phone,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên chi nhánh"),
      phone: Yup.string()
        .length(10, "Số điện thoại không chính xác")
        .required("Nhập số điện thoại")
        .matches(/^\d+$/),
      address: Yup.string().required("Nhập địa chỉ"),
      city: Yup.string().required("Chọn tỉnh/ thành phố"),
      ward: Yup.string().required("Chọn phường/ xã"),
      district: Yup.string().required("Chọn quận/ huyện"),
    }),
  });
  useEffect(() => {
    const loadCity = async () => {
      try {
        const res = await userApi.getCity();
        setCityList(res.provinces);
      } catch (error) {
        console.log(error);
      }
    };
    loadCity();
  }, []);
  useEffect(() => {
    const loadDistrict = async (city_id) => {
      if (city_id) {
        try {
          const res = await userApi.getDistrict(city_id);
          setDistrictList(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    loadDistrict(formik.values.city);
  }, [formik.values.city]);
  useEffect(() => {
    const loadWard = async (city_id, district_id) => {
      if (city_id && district_id) {
        try {
          const res = await userApi.getWard(city_id, district_id);
          setWardList(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    loadWard(formik.values.city, formik.values.district);
  }, [formik.values.city, formik.values.district]);

  const dispatch = useDispatch();
  const handleEditBranch = async () => {
    closeModalAndResetData();
    const ward = wardList.find((ward) => ward.id === formik.values.ward)
      ? wardList.find((ward) => ward.id === formik.values.ward).name
      : "";
    const province = cityList.find((city) => city.id === formik.values.city)
      ? cityList.find((city) => city.id === formik.values.city).name
      : "";
    const district = districtList.find(
      (district) => district.id === formik.values.district
    )
      ? districtList.find((district) => district.id === formik.values.district)
          .name
      : "";
    let lat, lng;
    try {
      ({ lat, lng } = await getGeoCode(
        formik.values.address + " " + ward + " " + district + " " + province,
        info.store.key
      ));
    } catch (error) {
      console.log(error);
    }
    try {
      var bodyFormData = new FormData();
      bodyFormData.append("name", formik.values.name.toString());
      bodyFormData.append("address", formik.values.address.toString());
      bodyFormData.append("ward", ward);
      bodyFormData.append("province", province);
      bodyFormData.append("district", district);
      bodyFormData.append("phone", formik.values.phone.toString());
      bodyFormData.append("status", "active");
      bodyFormData.append("lng", lng ? lng.toString() : "");
      bodyFormData.append("lat", lat ? lat.toString() : "");
      if (image && typeof image !== "string") {
        bodyFormData.append("image", image);
      }
      const response = await branchApi.updateBranch(
        store_uuid,
        branch.uuid,
        bodyFormData
      );
      dispatch(statusAction.successfulStatus("Chỉnh sửa chi nhánh thành công"));
      props.onReload();
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Chỉnh sửa chi nhánh thất bại"));
    }
  };
  const handleDeleteBranch = async () => {
    setIsDelete(false);
    handleClose();
    try {
      await branchApi.deleteBranch(store_uuid, branch.uuid);
      let response = await branchApi.getBranches(store_uuid);
      dispatch(infoActions.setBranches(response.data));
      props.onReload();
      dispatch(statusAction.successfulStatus("Xóa chi nhánh thành công"));
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("xóa chi nhánh thất bại"));
    }
  };
  const closeModalAndResetData = () => {
    handleClose();
    formik.resetForm();
    clearImage();
  };
  console.log(formik.errors);
  return (
    <SimpleModal open={open} handleClose={closeModalAndResetData}>
      <ConfirmPopUp
        open={isDelete}
        handleConfirm={handleDeleteBranch}
        handleClose={() => setIsDelete(false)}
        message={
          <Typography>
            Xóa vĩnh viễn chi nhánh <b>{branch.name} ?</b>
          </Typography>
        }
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa chi nhánh mới
        </Typography>
        <Button
          variant="contained"
          size="small"
          style={{ marginRight: 20 }}
          color="secondary"
          onClick={() => setIsDelete(true)}
        >
          Xóa chi nhánh
        </Button>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        {display.length ? (
          <Tooltip title="Xóa hình ảnh">
            <Button size="small" onClick={clearImage}>
              <Box
                component="img"
                sx={{
                  height: 70,
                  width: 70,
                  marginLeft: 7,
                  marginRight: 7,
                  borderRadius: 2,
                }}
                src={display}
              />
            </Button>
          </Tooltip>
        ) : (
          <UploadImages />
        )}

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file"
          type="file"
          onChange={addImageHandler}
        />
        {display.length === 0 ? (
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        ) : null}
      </Box>
      <Grid container spacing={2} style={{ maxWidth: 600, marginTop: 10 }}>
        <Grid item xs={12}>
          <TextField
            name="name"
            variant="outlined"
            required
            fullWidth
            label="Tên chi nhánh"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
            helperText={formik.touched.name ? formik.errors.name : null}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Số điện thoại"
            name="phone"
            onChange={formik.handleChange}
            value={formik.values.phone}
            error={formik.touched.phone && formik.errors.phone}
            helperText={formik.touched.phone ? formik.errors.phone : null}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={7}>
          <FormControl
            required
            fullWidth
            variant="outlined"
            error={formik.touched.city && formik.errors.city}
            helperText={formik.touched.city ? formik.errors.city : null}
          >
            <InputLabel>Tỉnh</InputLabel>
            <Select
              native
              name="city"
              label="Tỉnh"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" />
              {cityList.map((city) => (
                <option value={city.id}>{city.name}</option>
              ))}
            </Select>
            {formik.touched.city ? (
              <FormHelperText>{formik.errors.city}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            required
            fullWidth
            variant="outlined"
            error={formik.touched.district && formik.errors.district}
            onBlur={formik.handleBlur}
          >
            <InputLabel>Quận</InputLabel>
            <Select
              native
              label="Quận"
              name="district"
              value={formik.values.district}
              onChange={formik.handleChange}
            >
              <option value="" />
              {districtList.map((district) => (
                <option value={district.id}>{district.name}</option>
              ))}
            </Select>
            {formik.touched.district ? (
              <FormHelperText>{formik.errors.district}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            required
            fullWidth
            variant="outlined"
            error={formik.touched.ward && formik.errors.ward}
            onBlur={formik.handleBlur}
          >
            <InputLabel htmlFor="ward">Phường</InputLabel>
            <Select
              native
              label="Phường"
              name="ward"
              value={formik.values.ward}
              onChange={formik.handleChange}
              helperText={formik.touched.ward ? formik.errors.ward : null}
            >
              <option aria-label="None" value="" />
              {wardList.map((ward) => (
                <option value={ward.id}>{ward.name}</option>
              ))}
            </Select>
            {formik.touched.ward ? (
              <FormHelperText>{formik.errors.ward}</FormHelperText>
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
            onChange={formik.handleChange}
            value={formik.values.address}
          />
        </Grid>
      </Grid>{" "}
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingTop: 20,
        }}
      >
        <Button
          variant="contained"
          size="small"
          style={{ marginRight: 20 }}
          onClick={closeModalAndResetData}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleEditBranch}
          style={{ marginRight: 20 }}
          disabled={!(formik.isValid && Object.keys(formik.touched).length > 0)}
        >
          Sửa
        </Button>
      </Grid>
    </SimpleModal>
  );
};

export default EditBranch;
