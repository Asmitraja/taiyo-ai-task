

import { useEffect, useState } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Chart from 'chart.js/auto';
import "leaflet/dist/leaflet.css";
import "../Css/ChartsAndMaps.css";

const fetchChartData = async () => {
  return await axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
};

const ChartsAndMaps = () => {
  const [chartData, setChartData] = useState({});
  const [countryData, setCountryData] = useState([]);

  const fetchCountryData = async () => {
    const res = await axios.get('https://disease.sh/v3/covid-19/countries');
    const data = res.data;

    const countryData = data.map((country) => ({
      name: country.country,
      lat: country.countryInfo.lat,
      long: country.countryInfo.long,
      active: country.active,
      recovered: country.recovered,
      deaths: country.deaths,
    }));

    setCountryData(countryData);
  };

  useEffect(() => {
    fetchChartData().then((res) => setChartData({
      labels: Object.keys(res.data.cases),
      datasets: [
        {
          label: "COVID-19 Cases",
          data: Object.values(res.data.cases),
          backgroundColor: "red",
        }
      ]
    }));
    fetchCountryData();
  }, []);

  useEffect(() => {
    const chartConfig = {
      type: 'line',
      data: chartData,
    };

    const myChart = new Chart(document.getElementById('myChart'), chartConfig);
    return () => {
      myChart.destroy();
    };
  }, [chartData]);

  return (
    <div>
      <div style={{ height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#212833', marginBottom:"1px" }}>
        <Heading className='mukta-extralight' style={{ color: 'white', padding: '10px 20px', fontSize: "40px" }}>Charts and Maps</Heading>
      </div>
      <Flex>
        {/* Sidebar */}
        <Box bg="#343a40" color="white" p={4} width="200px"> {/* Set a fixed width for the sidebar */}
          <Box mb={6}>
            <Link to="/" style={{ textDecoration: "none", color: "white", padding:"4px"}}>
              <Box mb={2}>Contacts</Box>
            </Link>
            <Link to="/chartsandmaps" style={{ textDecoration: "none", color: "white" }}>
              <Box>Charts & Maps</Box>
            </Link>
          </Box>
        </Box>

        {/* Main Content */}
        <Box flex="1"> {/* Let the main content take the remaining space */}
          <div id="charts_page_div">
            {/* {window.innerWidth > 900 ?
              <Box padding={"10px"} w={"19%"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
                <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold", color: "white" }} to="/">Contacts</Link></Box>
                <br />
                <br />
                <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold", color: "white" }} to="/chartsandmaps">Charts & Maps</Link></Box>
              </Box> :
              <Flex justifyContent={"space-evenly"} w={"100%"} margin={'auto'} marginBottom={"20px"} p={"10px 0px"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
                <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold", color: "white" }} to="/">Contacts</Link></Box>
                <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold", color: "white" }} to="/chartsandmaps">Charts & Maps</Link></Box>
              </Flex>
            } */}
            <Box padding={"30px"} margin={'auto'} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"} border={"1px solid gray"}>
              <Heading>COVID-19 Dashboard</Heading>
              <Box>
                {window.innerWidth > 900 ? <canvas id="myChart" width="800" height="300"></canvas> : <canvas id="myChart" width="400" height="300"></canvas>}
              </Box>
              <br />
              <br />
              <Box>
                <MapContainer center={[0, 0]} zoom={2} >
                  <TileLayer url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=NLe8DG6CVIhkI4PpAXR1" />
                  {countryData.map((country) => (
                    <Marker key={country.name} position={[country.lat, country.long]}>
                      <Popup>
                        <h4>Name: {country.name}</h4>
                        <p>Active Cases: {country.active}</p>
                        <p>Recovered Cases: {country.recovered}</p>
                        <p>Deaths: {country.deaths}</p>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
            </Box>
          </div>
        </Box>
      </Flex>
    </div>
  )
}

export default ChartsAndMaps;
