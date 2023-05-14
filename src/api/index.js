import axios from "axios";

import { memoize } from "../util/memoize";

const URL = 'https://travel-advisor.p.rapidapi.com/hotels/list-in-boundary';

export const getPlacesData = memoize(async (type, sw, ne) => {
    try {
        const { data } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
            params: {
                // bl_latitude: sw.lat,
                // bl_longitude: ne.lat,
                // tr_longitude: sw.lng,
                // tr_latitude: ne.lng
                bl_latitude: '11.847676',
                bl_longitude: '108.473209',
                tr_longitude: '109.149359',
                tr_latitude: '12.838442'
            },
            headers: {
                'X-RapidAPI-Key': '7f9473b964msh2277ba3d47ba47ep199bc3jsne62fc7eb6c6e',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
            }
        });
        
        return data;
    } catch (err) {
        console.log(err);
    }
});