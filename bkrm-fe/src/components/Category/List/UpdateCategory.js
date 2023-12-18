import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ModalWrapper from "../../../components/Modal/ModalWrapper";
import productApi from "../../../api/productApi";
import { useSelector, useDispatch } from "react-redux";
import { statusAction } from "../../../store/slice/statusSlice";
import ConfirmPopUp from "../../ConfirmPopUp/ConfirmPopUp";

const UpdateCategory = (props) => {
    const [categoryInfo, setCategoryInfo] = useState({
        name: "",
        parent_category_uuid: "",
    });
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const dispatch = useDispatch();
    useEffect(() => {
        setCategoryInfo(props.category);
    }, [props.category]);
    const [isDelete, setIsDelete] = useState(false);
    const handleUpdateCategory = async () => {
        handleCloseAndReset();
        try {
            await productApi.editCategory(
                store_uuid,
                props.category.uuid,
                categoryInfo
            );
            props.onReset();
            dispatch(statusAction.successfulStatus("Cập nhật danh mục thành công"));
        } catch (error) {
            console.log(error);
            dispatch(statusAction.failedStatus("Cập nhật danh mục thất bại"));
        }
    };
    const handleDeleteCategory = async () => {
        handleCloseAndReset();
        if (props.category.children.length > 0) {
            dispatch(
                statusAction.failedStatus(
                    "Không thể xóa danh mục do có danh mục con, hãy xóa danh mục con trước"
                )
            );
            return;
        }
        try {
            await productApi.deleteCategory(store_uuid,props.category.uuid);
            props.onReset();
            dispatch(statusAction.successfulStatus("Xóa danh mục thành công"));
        } catch (error) {
            console.log(error);
            dispatch(statusAction.failedStatus("Xóa danh mục thất bại"));
        }
    };
    const handleCloseAndReset = () => {
        props.handleClose();
        setCategoryInfo(props.category);
    };
    return (
        <ModalWrapper {...props}>
            <Typography variant="h4" gutterBottom>
                Cập nhật danh mục
            </Typography>
            <ConfirmPopUp
                open={isDelete}
                handleConfirm={handleDeleteCategory}
                handleClose={() => setIsDelete(false)}
                message={
                    <Typography>
                        Xóa vĩnh viễn danh mục <b>{props.category.name} ?</b>
                    </Typography>
                }
            />
            <Grid container spacing={2} style={{ marginTop: 10, maxWidth: 300 }}>
                <Grid item xs={12}>
                    <TextField
                        label="Tên danh mục"
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                        value={categoryInfo?.name}
                        onChange={(e) =>
                            setCategoryInfo({ ...categoryInfo, name: e.target.value })
                        }
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                >
                    {" "}
                    <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        style={{ marginRight: 20 }}
                        onClick={() => {
                            setIsDelete(true);
                        }}
                    >
                        Xóa danh mục
                    </Button>
                    <Button
                    color="primary"
                        variant="contained"
                        onClick={handleUpdateCategory}
                        size="small"
                    >
                        Lưu thay đổi
                    </Button>
                </Grid>
            </Grid>
        </ModalWrapper>
    );
};

export default UpdateCategory;
