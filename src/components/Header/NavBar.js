import React from 'react';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from '@material-ui/core';

import useStyles from './styles'

const Navbar = () => {
    const classes = useStyles();
    return(
        <AppBar position='static'>
            <Toolbar className={classes.toolbar}>
                <Typography variant='h5' className={classes.title}>
                    Travel planning
                </Typography>
                <Link to="/trips">
                        <Button>
                            <Typography variant='h6' className={classes.title} style={{color: 'white'}}>
                            Trips
                            </Typography>
                        </Button>
                    </Link>
                <Box display='flex'>                       
                    <Link to="/research">
                        <Button>
                            <Typography variant='h6' className={classes.title} style={{color: 'white'}}>
                            Research
                            </Typography>
                        </Button>
                    </Link>
                </Box>
            </Toolbar>

        </AppBar>
    );
}

export default Navbar;