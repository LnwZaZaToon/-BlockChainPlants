import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import NavBar from './navbar';

const UserPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState('user'); // Default to 'user', but can be fetched from API or context

  useEffect(() => {
    // Fetching the data when the component is mounted
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/User');  // Replace with the actual API endpoint
        const result = await response.json();
        const filteredResult = result.filter(item => item.granted === "user");
        setData(result);

        // Assuming the API can return profile information like 'admin' or 'user'
        const profileResponse = await fetch('/api/profile');  // Replace with the actual API for profile info
        const profileResult = await profileResponse.json();
        setProfileType(profileResult.profileType); // Example: 'admin' or 'user'
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <NavBar />
    <Container className="my-5">
      <h2 className="text-center mb-4">User Information</h2>
      
      {/* Display profile type */}
      <Alert variant={profileType === 'admin' ? 'warning' : 'info'}>
        <strong>{profileType === 'admin' ? 'Admin' : 'User'}</strong> profile is active.
      </Alert>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Row>
          {data.length > 0 ? (
            data.map((item) => (
              <Col key={item.id} md={4} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Button variant="primary">View More</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No data found.</p>
          )}
        </Row>
      )}
    </Container>
    </div>
  );
};

export default UserPage;
