import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const { login, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedInLoader, setLoggedInLoader] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
    setLoggedInLoader(true);
    try {
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      login();
      setUser(data);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoggedInLoader(false);
    }
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
              {!loggedInLoader && "Log in"}
              {loggedInLoader && (
                <Spinner
                  style={{ width: "20px", height: "20px" }}
                  animation='border'
                  role='status'
                />
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='text-center'>
        <span>Don't have an account yet? </span>
        <Link to='/register'>Register</Link>
      </div>
    </Container>
  );
}
