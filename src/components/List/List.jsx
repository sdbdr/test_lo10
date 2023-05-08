import React, { useState } from 'react';
import { CircularProgress, Grid, Typrography, InputLabel, MenuItem, FormControl, Typography, Select } from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails'

import useStyles from './styles'

const List = ({ places }) => {
    const classes=useStyles();
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    return(
        <div className={classes.container}>
            <Typography variant='h4'> Restaurants, Hotels, et activités autour</Typography>
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
                {places?.map((place, i ) => (
                    <Grid item key={i} xs={12}>
                        <PlaceDetails place={place} />
                    </Grid>
                ))}
            </Grid>

        </div>
    );
}

export default List;