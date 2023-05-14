import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab';

import useStyles from './styles'

const Map = ({ setBounds, coordinantes, setCoordinates }) => {
    const classes= useStyles();
    const isMobile = useMediaQuery('(min-width:600px)');
    const key="AIzaSyCfG68QKZf-Ohn10myXzvl4aMKFSoGLd1g";

    const coordinates = { lat: 2, lng: 2 }

    return(       
         <div className={ classes.mapContainer }>
            <GoogleMapReact 
                bootstrapURLKeyrs={{ key: key }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50,50,50,50]}
                options={''}
                onChange={(e) => {
                    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
                }}
                onChildClick={''}
                >   
            </GoogleMapReact>

        </div> 

    );
}

export default Map;