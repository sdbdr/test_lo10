import React from 'react';
import TripNavBar from '../TripNavBar';
import { Context } from '../context';
import { useContext, useEffect } from 'react';



const Trip_Itinary = () => {
   
   
    const { id, setId } = useContext(Context);

    useEffect(() => {
      const storedId = localStorage.getItem('id');
      setId(storedId);
    }, [setId]);
   
    return(
        <div >
          <p>itinary id={id}</p>
          <TripNavBar />
        </div>
    );
}

export default Trip_Itinary;