import Geocode from "react-geocode";

const getGeoCode = async (location,key) => {
  Geocode.setApiKey(key);
  Geocode.setRegion("vn");
  try {
    const response = await Geocode.fromAddress(location);
    const { lat, lng } = response.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.log(error);
  }
};

export default getGeoCode;
