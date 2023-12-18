import React , {useState}from 'react'
import {
    Button,
    TextField,
    Typography,
    Grid,
    Box,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    IconButton,
    Tooltip,
    Dialog,
    FormControlLabel,
    Switch,
    Collapse,
    Paper,
    Card,
    CardHeader,
    Checkbox,
  } from "@material-ui/core";
  import AddIcon from "@material-ui/icons/Add";
  import avaUpload from "../../assets/img/product/default-product.png";

const AddMultipleImage = ({imageURL, setImageURL,images,setImages,display,setDisplay}) => {

    // const [display, setDisplay] = useState([]);
    // const [imageURL, setImageURL] = useState("");

    
    const addImageHandler = (e) => {
      console.log(e.target.files[0]);
      console.log(URL.createObjectURL(e.target.files[0]));
      setImages([...images, e.target.files[0]]);
      setDisplay([
        ...display,
        {
          index: images.length,
          link: URL.createObjectURL(e.target.files[0]),
          isUrl: false,
        },
      ]);
    };

    const clearImage = (displayImage) => {
        setDisplay(display.filter((img) => img != displayImage));
        if (displayImage.isUrl) {
          setImageURL("");
        } else {
          setImages(images.filter((image, index) => index !== displayImage.index));
        }
    };
  return (
    <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ marginTop: 10 }}
        >
            {display.map((img) => (
            <Tooltip title="Xóa tất cả hình ảnh">
                <Button size="small" onClick={() => clearImage(img)}
                >
                <Box
                    component="img"
                    sx={{
                    height: 70,
                    width: 70,
                    marginLeft: 7,
                    marginRight: 7,
                    borderRadius: 2,
                    }}
                    src={img.link}
                />
                </Button>
            </Tooltip>
            ))}
            {display.length === 0 ? <UploadImages /> : null}
            <IconButton
            disabled={display.length > 5 ? true : false}
            color="primary"
            size="medium"
            component="label"
            >
            <input type="file" hidden onChange={addImageHandler} />
            <AddIcon />
            </IconButton>
        </Box>
  )
}

export default AddMultipleImage


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