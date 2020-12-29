import { MenuItem, Select, FormControl,Card, CardContent} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import Infobox from './Infobox'
import Map from './Map'
import Table from './Table'
import {sortData} from './util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from './util'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryinfo]=useState({})
  const [tableData, setTableData] =useState([]);
  const [mapCenter, setMapCenter]=useState({lat:34.80746, lng:-40.4796})
  const [mapZoom,setMapZoom] = useState(3)
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType, setCasesType]=useState("cases")


  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=> response.json())
    .then(data=>{
      setCountryinfo(data)
    })
  },[])

  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then(data => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))
          const sortedData=sortData(data);
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getCountryData();
  }, [])


  const onCountryChange = async (e) => {
    const countrycode = e.target.value;
    setCountry(countrycode)

    const url = countrycode==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countrycode}`;

    await fetch(url)
    .then((response)=> response.json())
    .then(data=> {
      setCountry(countrycode)
      setCountryinfo(data)


      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
      
    })
  }



  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid 19 Tracker</h1><br/>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
              className="selecttab"
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {
                countries.map(country => {
                  return (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_status">
          <Infobox onClick={e=>setCasesType('cases')}  title="Coronavirus cases" total={prettyPrintStat(countryInfo.todayCases) } cases={prettyPrintStat(countryInfo.cases)} />
          <Infobox onClick={e=>setCasesType('recovered')} title="Recovered" total={prettyPrintStat(countryInfo.todayRecovered)} cases={prettyPrintStat(countryInfo.recovered)}  />
          <Infobox onClick={e=>setCasesType('deaths')} title="Deaths" total={prettyPrintStat(countryInfo.todayDeaths)} cases={prettyPrintStat(countryInfo.deaths)} />
        </div>
        <Map 
        casesType={casesType}
        countries={mapCountries}
        center={mapCenter} 
        zoom={mapZoom} 
        />
      </div>
      <Card className="app_right">
          <CardContent>
            <h3>Live cases by country</h3>
            <Table countries={tableData} />

            <h3>world wide new {casesType}</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
      </Card>


      
    </div>
  );
}

export default App;
