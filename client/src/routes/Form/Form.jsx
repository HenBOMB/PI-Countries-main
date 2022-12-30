import { useEffect } from 'react';
import { useState } from 'react';
import { getCountries } from '../Home/Home';
import './Form.css';

export default function Form(){

    const [form, setForm] = useState({
        name: '',
        difficulty: '2',
        duration: '0',
        season: 'summer',
        selected: []
    });

    const [errors, setErrors] = useState({
        name: 'Ingrese un nombre',
        duration: ''
    });

    const [query, setQuery] = useState('');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        getCountries().then(setCountries);
    }, []);

    function handleForm(e){
        const errors = { };

        // eslint-disable-next-line default-case
        switch(e.target.name) {
            case 'name':
                if(e.target.value === '') 
                    errors.name = 'Ingrese un nombre';
                else if(e.target.value.match(/\W/g))
                    errors.name = 'Nombre no puede tener caracteres especiales';
                else if(e.target.value.match(/\d/g))
                    errors.name = 'Nombre no puede tener numeros';
                break;
            case 'duration':
                if(e.target.value === 0)
                    errors.duration = 'Duracion no puede ser zero';
                else if(e.target.value < 0)
                    errors.duration = 'Duracion no puede ser negativo';
                else if(e.target.value > 7)
                    errors.duration = 'Duracion no puede superar 1 semana';
                break;
        }

        setErrors(errors);

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    function handleQuery(e){
        setQuery(e.target.value);
        getCountries(e.target.value).then(setCountries);
    } 

    function handleAdd(country){
        let selection = [...form.selected, [country.id, country.image]]
        setForm({
            ...form,
            selected: selection
        });
        selection = selection.map(v => v[0]);
        getCountries(query).then(cs => setCountries(cs.filter(({id}) => !selection.includes(id))));
    }

    function handleRemove(id){
        let selection = form.selected.filter(sel => sel[0] !== id);
        setForm({
            ...form,
            selected: selection
        });
        selection = selection.map(v => v[0]);
        getCountries(query).then(cs => setCountries(cs.filter(({id}) => !selection.includes(id))));
    }

    function handleSubmit(e){
        e.preventDefault();

        fetch('http://localhost:3001/activities', {
            method: 'POST',
            body: JSON.stringify({
                ...form,
                selected: form.selected.map(arr => arr[0])
            }),
            headers: {
              'Content-Type': 'application/json'
            }
        });
    }

    return (
        <div className="Form">
            <form action="submit">
                <label>Nombre</label>
                <input 
                    type="text" 
                    name='name'
                    placeholder='Name' 
                    value={form.name}
                    onChange={handleForm}
                />
                <span className='error' hidden={!errors.name}>{errors.name}</span>

                <label>Dificultad</label>
                <select 
                    name='difficulty'
                    defaultValue={form.difficulty}
                    onChange={handleForm}
                >
                    <option value="1">Breathing is harder.</option>
                    <option value="2">Can I play, Daddy?</option>
                    <option value="3">Don't hurt me.</option>
                    <option value="4">Bring 'em on!</option>
                    <option value="5">I am Death incarnate!</option>
                </select>

                <label>Duracion <span className='small'>(dias)</span></label>
                <input 
                    type="number" 
                    name='duration'
                    placeholder='Duracion' 
                    value={form.duration}
                    onChange={handleForm}
                />
                <span className='error' hidden={!errors.duration}>{errors.duration}</span>

                <label>Temporada</label>
                <select 
                    name='season'
                    defaultValue={form.season}
                    onChange={handleForm}
                >
                    <option value="summer">Verano</option>
                    <option value="autum">Otoño</option>
                    <option value="winter">Invierno</option>
                    <option value="spring">Primavera</option>
                </select>

                <br/>
                <label>Countries</label>
                <input type="text" placeholder='Search' value={query} onChange={handleQuery} />
                {
                    <div className='results'>
                        {countries.map(c => <span key={c.id} onClick={()=>handleAdd(c)}>{c.name}</span>)}
                    </div>
                }

                <br/>
                <div className='selection'>
                    {form.selected.map(arr => <img key={arr[0]} src={arr[1]} alt={arr[0]} onClick={()=>handleRemove(arr[0])} />)}
                </div>

                <button type='submit' onClick={handleSubmit} disabled={Object.keys(errors).length}>Create</button>
            </form>
        </div>
    )
}