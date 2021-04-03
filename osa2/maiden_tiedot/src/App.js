import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Filter = ({onChange, filterName}) => {
    return (
        <div> find countries <input
            value={filterName}
            onChange={onChange}
        />
        </div>
    )
}

const Data = ({dataToShow, showFinalData}) => {
    return (
        <div>{dataToShow.map(data => {
            return (
                <div>
                    <p key={data.name}>{data.name}
                        <button onClick={() => showFinalData(data.name)}>show</button>
                    </p>
                </div>
            )
        })}</div>
    )
}
const FinalData = ({dataToShow}) => {
    const api_key = process.env.REACT_APP_API_KEY
    const [weather, setWeather] = useState()
    useEffect(() => {

        console.log('data', dataToShow)
        axios
            .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${dataToShow[0].capital}, ${dataToShow[0].name}`)
            .then(response => {
                console.log('promise fulfilled')

                setWeather(response.data)

            })
    }, [])



    if (!weather) {
        return <div> </div>;
    } else {
        return (
            <div>
                {dataToShow.map(data => {
                    return (
                        <div key={data.name}>
                            <h1>
                                {data.name}
                            </h1>
                            <div>
                                capital {data.capital}
                            </div>
                            <div>
                                population {data.population}
                            </div>
                            <h2>languages</h2>
                            <ul>{data.languages.map((language) => <li>{language.name}</li>)}</ul>
                            <img src={data.flag} max-width="300px"
                                 height="200px" alt={'flag of ' + data.name}/>
                            <h2>Weather in {weather.location.name}</h2>
                            <p>temperature: {weather.current.temperature}℃</p>
                            <img src={weather.current.weather_icons[0]}/>
                        <p>wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
                        </div>

                    )
                })}
            </div>
        )
    }
}

const App = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        console.log('effect')
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                console.log('promise fulfilled')
                setData(response.data)
            })
    }, [])
    console.log('render', data.length, 'data')
    const [filterName, setFilterName] = useState('')
    const handleFilterChange = (event) => {
        console.log(event.target.value)
        setFilterName(event.target.value)
    }

    const showFinalData = (data) => {
        setFilterName(data)
    }

    const dataToShow = data.length < 11
        ? data
        : data.filter(data => {
            return data.name.toLowerCase().includes(filterName.toLowerCase())
        })


    let result = <p>Too many matches, specify another filter</p>
    if (dataToShow.length < 11 && dataToShow.length > 1) {
        result = <Data dataToShow={dataToShow} showFinalData={showFinalData}/>
    } else if (dataToShow.length === 1) {
        result = <FinalData dataToShow={dataToShow}/>
    }

    return (
        <form>
            <div>
                <Filter filterName={filterName} onChange={handleFilterChange}/>

            </div>
            {result}
        </form>
    );
}

export default App;
