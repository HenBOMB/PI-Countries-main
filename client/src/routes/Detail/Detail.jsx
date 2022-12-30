import './Detail.css';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Detail() {
    const { id } = useParams();
    const [country, setCountry] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/countries/${id.toUpperCase()}`)
            .then((response) => response.json())
            .then(setCountry)
            .catch(() => setCountry(null))
    }, [id]);

    if(!country) {
        return (
            <div className='Detail err'>
                Sorry, no country with that ID was found
            </div>
        )
    }
    
    return (
        <div className='Detail'>
            <div className='header'>
                <img src={country.image} alt={country.name} />
                <h1>{country.name} ({country.id})</h1>
            </div>
            <div className='content'>
                <div>
                    <h1>Region</h1>
                    <p>{country.region} ({country.subregion})</p>
                </div>
                <div>
                    <h1>Capital</h1>
                    <p>{country.capital}</p>
                </div>
            </div>
            <div className='content'>
                <div>
                    <h1>Area</h1>
                    <p>{country.area} km^2</p>
                </div>
                <div>
                    <h1>Population</h1>
                    <p>{country.population}</p>
                </div>
            </div>
            {
                country.activities && 
                <h1>Actividades Turisticas:</h1>
            }
            <div className='content'>
                {
                    country.activities && 
                    country.activities.map(activity => 
                        <div>
                            <h1>{activity.name}</h1>
                            <p>Dificultad: {[
                                "Breathing is harder.",
                                "Can I play, Daddy?",
                                "Don't hurt me.",
                                "Bring 'em on!",
                                "I am Death incarnate!"][activity.difficulty]}
                            </p>
                            <p>Temporada: {activity.season}</p>
                            <p>Duracion: {activity.duration} dias</p>
                        </div>
                    )
                }
                {
                    !country.activities.length && <p>Ninguna actividad turistica disponible</p>
                }
            </div>
        </div>
    )
}