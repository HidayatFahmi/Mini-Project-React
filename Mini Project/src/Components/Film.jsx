import  { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import './List.css'


export default function Film() {
  const [loading, setLoading] = useState(false);
  const [filmTitles, setFilmTitles] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const resp = await fetch('https://swapi.dev/api/vehicles/');
        const jsonResp = await resp.json();
        setVehicles(jsonResp.results);
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const fetchFilmTitle = async (filmUrl) => {
    try {
      const resp = await axios.get(filmUrl);
      const filmData = resp.data;
      return filmData.title;
    } catch (error) {
      console.log('Error:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchFilmTitles = async () => {
      const titles = await Promise.all(
        vehicles.map(async (vehicle) => {
        for(let a=0;a<=vehicle.length;a++){
          const filmTitle = await fetchFilmTitle(vehicle.films[a]);
          return filmTitle;
        }
        })
      );
      setFilmTitles(titles);
    };

    fetchFilmTitles();
  }, [vehicles]);

  return (
    <div>
      {loading && <div>loading...</div>}

      <Container fluid className="list">
        <Row className="justify-content-center">
          {vehicles.map((vehicle, index) => (
            <Col md={3} className="m-4 card" key={index}>
              <div className=' text-center'>
              <h3 className="text-center">{vehicle.name}</h3>
              <img  className='filmImg mt-3 mb-3' src={`${vehicle.cargo_capacity}.jpg`} alt="" />
              </div>
              <h4>Films:</h4>
              <ul>
                {filmTitles[index] && <li>{filmTitles[index]}</li>}
              </ul>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
