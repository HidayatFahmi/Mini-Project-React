import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, NavbarBrand, Card, Button} from 'react-bootstrap'
import {Link, BrowserRouter, Route, Routes, useParams} from "react-router-dom"
import { createContext, useContext, useState, useEffect } from "react";
import './List.css'
import Film from './Film';


const UserContext = createContext();

export default function Home(){

    const [vehicles, setVehicles] = useState([]);
    const [cari, setCari] = useState('');
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
    const fetchJsonPlaceHolder = async () => {
      try {
        setLoading(true);
        const resp = await fetch('https://swapi.dev/api/vehicles/');
        const jsonResp = await resp.json();
        setVehicles(jsonResp.results);
      } catch (error) {
        console.log('Error');
      } finally {
        setLoading(false);
      }
    };
  
    // Periksa apakah vehicles kosong sebelum memicu pengambilan data
    if (vehicles.length === 0) {
      fetchJsonPlaceHolder();
    }
  },[]);

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
        {loading && <div>loading...</div>}
        <Container fluid className="list">
        <BrowserRouter>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <NavbarBrand href="list" className='NavBarBrand'><img src="starwarslogo.png" alt="" /></NavbarBrand>
                    <Navbar.Collapse>
                    <Nav className='me-auto'>
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/film">Film</Nav.Link>
                    </Nav>              
                        <input type="text" value={cari} onChange={(event)=>setCari(event.target.value)} placeholder="Cari..."/>
                        <button onClick={handlePencarian}>Cari</button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    
            <UserProvider>
                <Routes>
                    <Route path='/' element={<Home2 />}/>
                    <Route path="/film" element={<Film />}/>
                    <Route path={"/detail/:Index"} element={<DetailCard />}/>
                </Routes>
            </UserProvider>        
        </BrowserRouter>

        </Container>

    </div>
    );
}


function Home2(){

    const {vehicles} = useContext(UserContext);

    return(
        <div>
            <Container fluid>
                <Row>
                    {vehicles.map((vehicle,index) => (
                    <Col key={index} md={2} className='card-container'> 
                        <Link to={`/detail/${index}`}>
                            <Card>
                            <Card.Img variant='top' src={`${vehicle.cargo_capacity}.jpg`} className='card-image'/>
                            <Card.Body>
                                <Card.Title><h5 style={{color:'blue'}}>{vehicle.name}</h5></Card.Title>
                            <Button variant="outline-primary">Detail</Button>
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


function DetailCard(){
    const {Index} = useParams();
    const {vehicles} = useContext(UserContext);
    

    if(vehicles[Index]){
    return(
            
        <div style={{color:'white'}} className='Card-Detail'>
        <Container fluid className='Card-Detail2 '>
        <Row className='justify-content-center'> 
            <Row >
                <Col className='mt-4 DetailCardImg'>  
                <Card.Img variant='top' src={`/${vehicles[Index].cargo_capacity}.jpg`} 
                className='card-image'/>
                <h3 className='mb-2 text-primary mt-3'>{vehicles[Index].name}</h3>  
                </Col>
            </Row>

            <Row className='justify-content-center mt-4'>
            <Col md={3} className='text-end lineHeight offset-3'>
            <p>Model
            <br/>
            Manufacturing
            <br/>
            Cost in Credits
            <br/>
            Length
            <br/>
            Max Atmosphering Speed 
            <br/>
            Crew 
            <br/>
            Passengers 
            <br/>
            cargo Capacity
            <br/>
            Consumables 
            <br/>
            Vehicle Class 
            </p>
            </Col>
   

        <Col md={6} className='lineHeight'>
            <p>
            : {vehicles[Index].model}
            <br/>
            : {vehicles[Index].manufacturer} 
            <br/>
            : {vehicles[Index].cost_in_credits}
            <br/>
            : {vehicles[Index].length}
            <br/>
            : {vehicles[Index].max_atmosphering_speed}
            <br/>
            : {vehicles[Index].crew}
            <br/>
            : {vehicles[Index].passengers}
            <br/>
            : {vehicles[Index].cargo_capacity}
            <br/>
            : {vehicles[Index].consumables}
            <br/>
            : {vehicles[Index].vehicle_class}
            </p>
        </Col>
        </Row>
        </Row>
        </Container>
        </div>
    )
    }
    else{
        return(
            <div>
                <p>Vehicle not found</p>
            </div>
        )
    }
}