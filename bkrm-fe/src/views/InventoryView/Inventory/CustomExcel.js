import { Box, Grid, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'

const CustomExcel = () => {
    const [customCl, setCustomCl] = useState({
        product_code: "Mã hàng",
        bar_code: "Mã vạch",
        name: "Tên",
        category_id: "Danh mục",
        list_price: "Giá bán",
        standard_price: "Giá vốn",
        quantity_per_unit: "Đơn vị",
        min_reorder_quantity: "Tồn kho nhỏ nhất",
        max_quantity: "Tồn kho lớn nhất",
        // urls: "Hình ảnh (url1, url2,...)",
        urls: "Hình ảnh",
        description: "Mô tả",
    })
    return (
        <Grid container spacing={2} style={{ marginBottom: 15, width: 600, maxWidth: "90vw" }} direction="row" justifyContent="center" alignItems="center">
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center" >
                    <Typography><b>Mã hàng</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.product_code} onChange={(e) => { setCustomCl({ ...customCl, product_code: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Mã vạch</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.bar_code} onChange={(e) => { setCustomCl({ ...customCl, bar_code: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Tên sản phẩm</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.name} onChange={(e) => { setCustomCl({ ...customCl, name: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Danh mục</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.category_id} onChange={(e) => { setCustomCl({ ...customCl, category_id: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Giá bán</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.list_price} onChange={(e) => { setCustomCl({ ...customCl, list_price: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Giá vốn</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.standard_price} onChange={(e) => { setCustomCl({ ...customCl, standard_price: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Đơn vị</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.quantity_per_unit} onChange={(e) => { setCustomCl({ ...customCl, quantity_per_unit: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Tồn kho nhỏ</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.min_reorder_quantity} onChange={(e) => { setCustomCl({ ...customCl, min_reorder_quantity: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Tồn kho lớn</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.max_quantity} onChange={(e) => { setCustomCl({ ...customCl, max_quantity: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Hình ảnh</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.urls} onChange={(e) => { setCustomCl({ ...customCl, urls: e.target.value }) }}></TextField>
                </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
                <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography><b>Mô tả</b></Typography>
                    <TextField label="Tên tùy chỉnh" size="small" variant="outlined" value={customCl.description} onChange={(e) => { setCustomCl({ ...customCl, description: e.target.value }) }}></TextField>
                </Box>
            </Grid>
        </Grid>
    )
}

export default CustomExcel