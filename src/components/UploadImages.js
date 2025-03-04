import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import NavBar from './navbar.js'; 

const UploadImage = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    e.preventDefault();
    // Handle image upload logic
    console.log('Image uploaded:', image);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
        <NavBar/>
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Upload Image</h3>
          <Form onSubmit={handleImageUpload}>
            <Form.Group controlId="formFile">
              <Form.Label>Select an image</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleImageChange} 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Upload
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
};

export default UploadImage;
