import axios from 'axios';

const URL ='https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'


export const getPlacesData = async (sw, ne) => {
    try {
         
        const {data : {data}} = await axios.get(URL, {
            params: {
              bl_latitude: sw.lat,
              tr_latitude: ne.lat,
              bl_longitude: sw.lng,
              tr_longitude: ne.lng,
            },
            headers: {
              'X-RapidAPI-Key': '443512613dmsh89b2f25f3a4ca82p106a94jsn09f36eea8a6b',
              'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
            }
          });
          return data; 
    } catch (error) {
        console.log(error);

    }
}