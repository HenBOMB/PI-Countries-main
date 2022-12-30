import './Home.css';
import './Countries.css';
import './Index.css';

import { useEffect, useState } from 'react';

const images = [
    'mexico.png',
    'iceland.jpg',
    'canada.png',
    'italy.png',
]

var maxPages = 0;

export function getCountries(query='', sort='', filter='') {
    return new Promise(resolve => {
        fetch('http://localhost:3001/countries')
            .then((response) => response.json())
            .then((countries) => {
                    countries = countries
                        .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
                        .filter(({ continent }) => !filter || continent.toLowerCase().includes(filter))
                        .sort(
                            (a, b) => {
                                switch(sort) {
                                    case 'az': return ('' + a.name).localeCompare(b.name);
                                    case 'za': return ('' + b.name).localeCompare(a.name);
                                    case 'pop': return b.population - a.population;
                                    default: return 0;
                                }
                            }
                        )
                    resolve(countries);
                }
            );
    });
}

export default function Home() {
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [results, setResults] = useState([]);

    useEffect(() => {
        getCountries().then(countries => {
            maxPages = Math.floor(countries.length / 10);
            setResults(countries);
        });
    }, []);

    function handleChange(e)
    {
        setQuery(e.target.value);
        setPage(1);
        getCountries(e.target.value, sort, filter).then(countries => {
            maxPages = Math.floor(countries.length / 10);
            setResults(countries);
        });
    }

    function handleFilter(e) 
    {
        const _filter = e.target.name !== filter? e.target.name : '';
        getCountries(query, sort, _filter).then(countries => {
            maxPages = Math.floor(countries.length / 9);
            setResults(countries);
        });
        setFilter(_filter)
    }

    function handleSort(e) 
    {
        const _sort = e.target.name !== sort? e.target.name : '';
        getCountries(query, _sort, filter).then(countries => {
            maxPages = Math.floor(countries.length / 9);
            setResults(countries);
        });
        setSort(_sort);
    }

    function handlePagination(e)
    {
        setPage(page+(e.target.name==='next'?1:-1))
    }

    function listPages() 
    {
        let arr = [];
        let limit = 2;

        for (let i = -2; i <= limit; i++) 
        {
            if(page + i <= 0) {
                limit++;
                continue;
            }

            if(page + i > maxPages) {
                // TODO: Add items to the start using the first index as page num
                // arr = [<span key={i}>{arr[0]}</span>, ...arr];
                break;
            }

            if(i === 0) 
            {
                arr.push(<span key={i} className='highlight'>{page + i}</span>);
                continue
            }

            arr.push(<span key={i}>{page + i}</span>);
        }

        return arr;
    }

    const min = (page-1)*(page===1?9:10);
    const max = page*(page===1?9:10);

    return (
        <div className="Home Countries">
            <div className="slide-wrapper">
                {images.map(name => 
                    <div className="slide" key={name}>
                        <img src={`images/${name}`} alt={name.slice(0,-4)} />
                        {/* <p>{name.slice(0,-4)}</p> */}
                    </div>
                )}
            </div>

            <div className='Nav'>
                <input type="text" onChange={handleChange} value={query} placeholder={'Search Country'}/>
                <div className="dropdown">
                    <button className="dropbtn">Continente</button>
                    <div className="dropdown-content">
                        <button name='africa' onClick={handleFilter} className={filter==='africa'?'selected':''}>Africa</button>
                        <button name='america' onClick={handleFilter} className={filter==='america'?'selected':''}>America</button>
                        <button name='antarctica' onClick={handleFilter} className={filter==='antarctica'?'selected':''}>Antarctic</button>
                        <button name='asia' onClick={handleFilter} className={filter==='asia'?'selected':''}>Asia</button>
                        <button name='europe' onClick={handleFilter} className={filter==='europe'?'selected':''}>Europe</button>
                        <button name='oceania' onClick={handleFilter} className={filter==='oceania'?'selected':''}>Oceania</button>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Ordenar</button>
                    <div className="dropdown-content">
                        <button name='az' onClick={handleSort} className={sort==='az'?'selected':''}>A-Z</button>
                        <button name='za' onClick={handleSort} className={sort==='za'?'selected':''}>Z-A</button>
                        <button name='pop' onClick={handleSort} className={sort==='pop'?'selected':''}>Poblacion</button>
                    </div>
                </div>
            </div>

            <div className='Results'>
                {
                    results
                    .slice(min<0?0:min, max)
                    .map(c => 
                        <a className='card' href={`/detail/${c.id}`} key={c.id} id={c.id}>
                            <img src={c.image} alt={c.name} />
                            <p>{c.name} ({c.continent})</p>
                            <p>{c.flag}</p>
                        </a>
                    )
                }
            </div>

            <div className='Footer'>
                <button onClick={handlePagination} disabled={page<=1}>Previous</button>
                <div className='pages'>{ listPages() }</div>
                <button name='next' onClick={handlePagination} disabled={page>=maxPages}>Next</button>
            </div>

        </div>
    )
}