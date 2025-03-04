import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import NavBar from './navbar.js'; 

const QuestsPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quests, setQuests] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('user'); // This can be set based on user role (user/admin)

  // Fetching quests assigned to the logged-in user
  const fetchQuests = async () => {
    try {
      const response = await fetch('/api/quests/assigned'); // Endpoint that returns the assigned quests
      const data = await response.json();
      setQuests(data);
    } catch (error) {
      console.error("Error fetching quests:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Assuming login logic here sets the logged-in state and the user role
    setIsLoggedIn(true);
    setUserRole('user'); // For demonstration, assume the logged-in user is a "user" role
    fetchQuests(); // Fetch quests after login
    console.log('Login submitted:', { email, password });
  };

  return (
    <div>
      <NavBar />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <Card.Body>
            <h3 className="text-center mb-4">Quests</h3>
            {!isLoggedIn ? (
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            ) : (
              <div>
                <h3 className="text-center mb-4">Assigned by Admin</h3>
                <Row>
                  {quests.length > 0 ? (
                    quests.map((quest) => (
                      <Col key={quest.id} md={6} className="mb-3">
                        <Card>
                          <Card.Body>
                            <Card.Title>{quest.title}</Card.Title>
                            <Card.Text>{quest.description}</Card.Text>
                            <Button 
                              variant="info" 
                              onClick={() => console.log('Quest selected', quest.id)}
                            >
                              Select Quest
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <p>No quests assigned at the moment.</p>
                  )}
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default QuestsPage;
