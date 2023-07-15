import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, NavbarBrand, Card} from 'react-bootstrap'
import {Link, BrowserRouter, Route, Routes} from "react-router-dom"
import { createContext, useContext, useState, useEffect } from "react";
import './List.css'
import Detail from './detail';
import { propTypes } from 'react-bootstrap/esm/Image';


const UserContext = createContext();

export default function ProductCard(){

    const [tampil, setTampil] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [cari, setCari] = useState('');

    function UserProvider({children}){

        return(
        <UserContext.Provider value={{vehicles, setVehicles}}>
        {children}
        </UserContext.Provider >
        );
    }

    const handlePencarian = async () =>{

        const response = await fetch(`https://swapi.dev/api/vehicles/?search=${cari}`);
        const data = await response.json();

         if (Array.isArray(data.results)) {
        setVehicles(data.results);
        } else {
        setVehicles([]);
  }

    }


    return(
        <div>
        <Container fluid className="list">

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <NavbarBrand href="list">StarWars</NavbarBrand>
                    <Navbar.Collapse>
                    <Nav className='me-auto'>
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#detail">List</Nav.Link>
                        <input type="text" value={cari} onChange={(event)=>setCari(event.target.value)} placeholder="Cari..."/>
                        <button onClick={handlePencarian}>Cari</button>
                    </Nav>              
                        <button onClick={() => setTampil(!tampil)}>{tampil? 'Close':'Details'}</button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        
        <BrowserRouter>
        <UserProvider>
            <Routes>
                <Route path='/' element={<List />}/>
                <Route path="/detail" element={<Detail />}/>
            </Routes>
        </UserProvider>        
        </BrowserRouter>

        </Container>

    </div>
    );
}


function List(){

    const [loading, setLoading] = useState(false);

    const {vehicles} = useContext(UserContext);
    const {setVehicles} = useContext(UserContext);


    useEffect(()=>{
        const fetchJsonPlaceHolder = async () => {
            try{
                setLoading(true);
                const resp = await fetch('https://swapi.dev/api/vehicles/');
                const jsonResp = await resp.json();
                setVehicles(jsonResp.results);
            }
            catch(error){
            console.log('Error')
            }finally{
            setLoading(false);
            }
        };
        fetchJsonPlaceHolder(); // promise -> relove, reject
    },[setVehicles]);


    return(
        <div>
            {loading && <div>loading...</div>}
            <Container fluid>
                <Row>
                    {vehicles.map((vehicle,index) => (
                    <Col key={index} md={2} className='card-container'>   
                        <Link to='/detail'>
                        <Card >
                        <Card.Img variant='top' src='avenger.jpg' className='card-image'/>
                        <Card.Body>
                            <Card.Title><h4 style={{color:'blue'}}>{vehicle.name}</h4></Card.Title>
                            <Card.Text>
                                {vehicle.model}
                            </Card.Text>
                        </Card.Body>
                        </Card>
                        </Link>
                    </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

propTypes