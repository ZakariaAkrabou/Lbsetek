import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MAPTILER_API_KEY = process.env.MAPTILER_API_KEY;
const MAPTILER_GEOCODING_URL = process.env.MAPTILER_API_URL;

/**
 * @param address 
 * @returns { lat, lon }
 */
export const geocodeAddress = async (address: string) => {
  try {
    const url = `${MAPTILER_GEOCODING_URL}geocoding/${encodeURIComponent(address)}.json?key=${MAPTILER_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.features && response.data.features.length > 0) {
      const [lon, lat] = response.data.features[0].geometry.coordinates;
      return { lat, lon };
    } else {
      throw new Error('No geocoding results found.');
    }
  } catch (error: any) {
    if (error.response) {
      // console.error('Geocoding API error:', {
      //   status: error.response.status,
      //   statusText: error.response.statusText,
      //   data: error.response.data,
      //   url: error.config?.url
      // });
    } else {
      console.error('Geocoding failed:', error);
    }
    throw new Error('Geocoding failed');
  }
};
