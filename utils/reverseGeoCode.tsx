import axios from 'axios';

export const getAddressFromLatLng = async (lat: number, lng: number) => {
  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: 'json',
        lat,
        lon: lng,
      },
    });

    return res.data.display_name || 'Unknown location';
  } catch (err) {
    console.error('Error in reverse geocoding:', err);
    return 'Unknown location';
  }
};
