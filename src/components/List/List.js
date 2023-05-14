import React, { useState, useEffect, createRef } from 'react';
import { 
    CircularProgress, 
    Grid, 
    Typrography, 
    InputLabel, 
    MenuItem, 
    FormControl, 
    Typography, 
    Select 
} from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails'

import useStyles from './styles'

const List = ({ places, childClicked, isLoading, type, setType, rating, setRating }) => {
    const classes = useStyles();
    const [elRefs, setElRefs] = useState([]);

    // console.log("PLACES", places);
    useEffect(() => {
        const refs = Array(places.length).fill().map((_, i) => refs[i] || createRef());
        setElRefs(refs);
    }, [places]);

    return(
        <div className={classes.container}>
            <Typography variant='h4'> Restaurants, Hotels, et activités autour</Typography>
            { isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>
                    <FormControl className={classes.formControl}>
                        <InputLabel> Type </InputLabel>
                        <Select value={type} onChange={(e) => setType(e.target.value)}>
                            <MenuItem value='restaurants'>Restaurants</MenuItem>
                            <MenuItem value='hotels'>Hotels</MenuItem>
                            <MenuItem value='activites'>Activités</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel> Note </InputLabel>
                        <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <MenuItem value={0}>Tous</MenuItem>
                            <MenuItem value={3}>Plus de 3</MenuItem>
                            <MenuItem value={4}>Plus de 4</MenuItem>
                            <MenuItem value={4.5}>Plus de 4.5</MenuItem>
                        </Select>
                    </FormControl>
                    <Grid container spacing={3} className={classes.list}>
                        {places ? places.map((place, i) => (
                            <Grid item key={i} xs={12}>
                                <PlaceDetails 
                                    place={place} 
                                    selected={Number(childClicked) === i}
                                    refProp={elRefs[i]}
                                />
                            </Grid>
                        )) : null}
                    </Grid>
                </>
            )}
        </div>
    );
}

export default List;