import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

import { getPlacesData } from './api';

const App = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null);

    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [bounds, setBounds] = useState(null);

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating);
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {
        setIsLoading(true);

        getPlacesData(type, bounds?.sw, bounds?.ne)
            .then(data => {
                if (data && data.data) setPlaces(data);
                else if (Array.isArray(data)) setPlaces(data);
                else setPlaces([]);
                
                setFilteredPlaces([]);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, [type, bounds]);
    
    return(
        <>
            <CssBaseline /> 
            <Header setCoordinates={setCoordinates} />
                <Grid container spacing={3} style={{width:'100%'}}>
                    <Grid item xs={12} md={4}>
                        <List 
                            places={filteredPlaces.length ? filteredPlaces : places} 
                            childClicked={childClicked}
                            isLoading={isLoading}
                            type={type}
                            setType={setType}
                            rating={rating}
                            setRating={setRating}
                        /> 
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Map 
                            setBounds={setBounds}
                            coordinates={coordinates}
                            setCoordinates={setCoordinates}
                            places={filteredPlaces.length ? filteredPlaces : places}
                            setChildClicked={setChildClicked}
                        /> 
                    </Grid>
                </Grid>
        </>
    )
}

export default App; 