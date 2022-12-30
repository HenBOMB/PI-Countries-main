import './Home.css';
import './Index.css';

const images = [
    'mexico.png',
    'iceland.jpg',
    'canada.png',
    'italy.png',
]

export default function Index() {
    return (
        <div className="Home Index Global">
            <div className="block"/>

            <div className="slide-wrapper">
                {images.map(name => 
                    <div key={name} className="slide">
                        <img src={`images/${name}`} alt={name.slice(0,-4) } />
                        {/* <p>{name.slice(0,-4)}</p> */}
                    </div>
                )}
            </div>
            
            <div className='button'>
                <a href="/home" className='a-button'>
                    Buscar!
                </a>
                <a href="/form" className='a-button'>
                    Formulario
                </a>
            </div>
            
        </div>
    )
}