import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import LockIcon from "@material-ui/icons/Lock";

//import library
import {
  Box,
  Grid,
  Collapse,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import Chip from "@mui/material/Chip";

//import icon
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";

//import image
import avaUpload from "../../../../../assets/img/product/lyimg.jpeg";
import { statusAction } from "../../../../../store/slice/statusSlice";

//import project
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import employeeApi from "../../../../../api/employeeApi";
import { useSelector, useDispatch } from "react-redux";
import EditEmployee from "../../AddEmployee/EditEmployee";
import ChangeEmployeePwd from "./ChangeEmployeePwd/ChangeEmployeePwd";
import { VNDFormat } from "../../../../../components/TextField/NumberFormatCustom";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(2),
      },
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
    typo: {
      marginBottom: 20,
    },
  })
);

const UploadImage = ({ src }) => {
  return (
    <Box
      component="img"
      sx={{
        height: 120,
        width: 120,
        borderRadius: 120,
        marginLeft: 15,
      }}
      src={src}
    />
  );
};

const permissionsMapping = {
  "manage-employees": "Nhân sự",
  "manage-orders": "Bán hàng",
  "manage-purchase-orders": "Đặt hàng",
  "manage-purchase-returns": "Nhập hàng",
};

const salaryTypeMapping = {
  fix: "Lương cứng",
  "per-shift": "Lương theo ca",
};

const EmployeeDetail = (props) => {
  const { row, openRow, handleReload } = props.parentProps;
  const { isMini } = props;

  const dispatch = useDispatch();

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [openEdit, setOpenEdit] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [employeeDetail, setEmployeeDetail] = React.useState({
    uuid: "",
    name: "",
    user_name: "",
    date_of_birth: "",
    id_card_num: "",
    phone: "",
    email: "",
    address: "",
    permissions: [],
    salary_type: "",
    salary: "",
    branches: [],
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const [reload, setReload] = useState(false);
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const response = await employeeApi.getEmployee(store_uuid, row.uuid);
        setEmployeeDetail(response.data);
      } catch (err) {
        setEmployeeDetail({
          uuid: "",
          name: "",
          user_name: "",
          date_of_birth: "",
          id_card_num: "",
          phone: "",
          email: "",
          address: "",
          permissions: [],
          salary_type: "",
          salary: "",
          branches: [],
        });
      }
    };
    if (openRow === row.uuid && store_uuid) {
      fetchEmp();
    }
  }, [openRow, reload]);
  const [changePwd, setChangePwd] = useState(false);
  return (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      {openEdit && (
        <EditEmployee
          handleClose={(status) => {
            if (status === "Success") {
              dispatch(statusAction.successfulStatus("Chỉnh sửa thành công"));
              setReload(!reload);
            } else if (status === "Failed") {
              dispatch(statusAction.failedStatus("Chỉnh sửa thất bại"));
            }
            setOpenEdit(false);
            handleReload();
          }}
          open={openEdit}
          employee={employeeDetail}
        />
      )}
      <ChangeEmployeePwd
        open={changePwd}
        handleClose={() => setChangePwd(false)}
        employeeDetail={employeeDetail}
      />
      <Box margin={1}>
        <Typography
          variant="h3"
          gutterBottom
          component="div"
          className={classes.typo}
        >
          {row.name}
        </Typography>

        <Grid container direction="row" justifyContent="flex-start">
          <Grid item xs={12} sm={3}>
            <UploadImage src={employeeDetail.img_url} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Mã nhân viên{" "}
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.employee_code}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Tên nhân viên{" "}
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.name}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Tên đăng nhập{" "}
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.user_name}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Ngày sinh
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.date_of_birth}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  CMND
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.id_card_num}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Số điện thoại
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.phone}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Email
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.email}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Địa chỉ
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.address}{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Chức năng
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.permissions.map((permission) => (
                    <Chip label={permission.description} />
                  ))}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Chi nhánh
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {employeeDetail.branches?.map((branch) => (
                    <Chip label={branch.name} />
                  ))}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Loại lương
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {salaryTypeMapping[employeeDetail.salary_type]}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Mức lương
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat value={employeeDetail.salary} />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Trạng thái
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.status === "active" ? "Kích hoạt" : "Ngưng hoạt động"}{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Button */}
        <Grid
          container
          direction="row"
          justifyContent={"flex-end"}
          style={{ marginTop: 20 }}
        >
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 15 }}
            onClick={() => {
              setOpenEdit(true);
            }}
          >
            Sửa
          </Button>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 15 }}
            onClick={async () => {
              if (row.status === "inactive") {
                try {
                  const response = await employeeApi.activeEmployee(
                    store_uuid,
                    employeeDetail.uuid
                  );
                  dispatch(
                    statusAction.successfulStatus("Kích hoạt thành công")
                  );
                  handleReload();
                } catch (err) {
                  console.log(err);
                  dispatch(statusAction.failedStatus("Kích hoạt thất bại"));
                }
              } else if (row.status === "active") {
                try {
                  const response = await employeeApi.inactiveEmployee(
                    store_uuid,
                    employeeDetail.uuid
                  );
                  dispatch(
                    statusAction.successfulStatus("Ngưng hoạt động thành công")
                  );
                  handleReload();
                } catch (err) {
                  dispatch(
                    statusAction.failedStatus("Ngưng hoạt động thất bại")
                  );
                }
              }
            }}
          >
            {row.status === "inactive" ? "Kích hoạt" : "Ngưng hoạt động"}
          </Button>

          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
            style={{ marginLeft: 10 }}
          >
            <MoreVertIcon />
          </IconButton>

          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem
              onClick={async () => {
                try {
                  const response = await employeeApi.deleteEmployee(
                    store_uuid,
                    employeeDetail.uuid
                  );
                  dispatch(
                    statusAction.successfulStatus("Xoá nhân viên thành công")
                  );
                  handleReload();
                } catch (err) {
                  dispatch(statusAction.failedStatus("Xoá nhân viên thất bại"));
                }
              }}
            >
              <ListItemIcon style={{ marginRight: -15 }}>
                <HighlightOffTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Xoá" />
            </StyledMenuItem>

            {info.role === "owner" && (
              <StyledMenuItem onClick={() => setChangePwd(true)}>
                <ListItemIcon style={{ marginRight: -15 }}>
                  <LockIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Mật khẩu" />
              </StyledMenuItem>
            )}
          </StyledMenu>
        </Grid>
      </Box>
    </Collapse>
  );
};

export default EmployeeDetail;
