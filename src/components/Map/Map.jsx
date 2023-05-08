import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab';

import useStyles from './styles'

const Map = () => {
    const classes= useStyles();
    const isMobile = useMediaQuery('(min-width:600px)');
    const key="AIzaSyCzdzA_9x6qIJDZiNrGc5B_GJn8mMSKnSk";

    const coordinates = { lat:0, lng:0}

    return(       
         <div className={classes.mapContainer}>
            <GoogleMapReact 
                bootstrapURLKeyrs={{ key : key }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50,50,50,50]}
                options={''}
                onChange={(e) =>{
/*                     setCoordinates({lat:e.center.lat, lng:e.center.lng});
                    setBounds({ ne : e.marginBounds.ne, sw : e.marginBounds.sw}); */
                }}
                onChildClick={''}
                >   
            </GoogleMapReact>

        </div> 

    );
}

export default Map;