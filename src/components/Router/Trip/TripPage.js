import React from 'react';

import TripBox from "./TripBox";

const data = {
    id : 24,
    title: "Paris Trip" ,
    description: "Trip quick description" ,
    subtitle: "Wed, Nov 17 - Mond, Dec 23" ,
    period: "6 Days, Group \"Buddies\""
}

const TripPage = () => {
    return(
        <div className="Trips">
            {/*une fois la base de donnée est implementée, on aura une liste des voyages retrouvées depuis la base de données, les infos des voyages
            peuevent etre ensuite passés en props pour chaque voyage */}
            <TripBox trip={data}/>
        </div>
    );
}

export default TripPage;