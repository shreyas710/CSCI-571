import { Container, Form, Button, Card } from "react-bootstrap";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
    // Add your authentication logic here
  };

  return (
    <Container className='d-flex flex-column align-items-center mt-5'>
      <Card style={{ width: "400px", padding: "20px", marginBottom: "15px" }}>
        <Card.Body>
          <h2 className='mb-4'>Login</h2>

          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-4' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant='primary'
              type='submit'
              className='w-100 py-2'
              style={{ backgroundColor: "#5883b0" }}>
              Log in
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='text-center'>
        <span>Don't have an account yet? </span>
        <a href='#register'>Register</a>
      </div>
    </Container>
  );
}
