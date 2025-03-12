import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { setUser, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [loggedInLoader, setLoggedInLoader] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register attempt with:", { name, email, password });
    setLoggedInLoader(true);
    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      console.log("Register response:", data);
      if (response.status === 401) {
        setErrorEmail(data.message);
        return;
      }
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
    <Container
      className='d-flex flex-column align-items-center mt-5'
      style={{ marginBottom: "50px" }}>
      <Card style={{ width: "400px", padding: "20px", marginBottom: "15px" }}>
        <Card.Body>
          <h2 className='mb-4'>Register</h2>

          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type='text'
                placeholder='John Doe'
                value={name}
                onChange={(e) => {
                  if (e.target.value == "") {
                    setErrorName("Fullname is required.");
                  } else {
                    setErrorName("");
                  }
                  setName(e.target.value);
                }}
                required
              />
              {errorName && (
                <Form.Text className='text-danger'>{errorName}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => {
                  if (emailRegex.test(e.target.value) == false) {
                    setErrorEmail("Email must be valid.");
                  } else {
                    setErrorEmail("");
                  }
                  setEmail(e.target.value);
                }}
                required
              />
              {errorEmail && (
                <Form.Text className='text-danger'>{errorEmail}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className='mb-4' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  if (e.target.value == "") {
                    setErrorPassword("Password is required.");
                  } else {
                    setErrorPassword("");
                  }
                  setPassword(e.target.value);
                }}
                required
              />
              {errorPassword && (
                <Form.Text className='text-danger'>{errorPassword}</Form.Text>
              )}
            </Form.Group>

            <Button
              disabled={
                name == "" ||
                email == "" ||
                password == "" ||
                errorName != "" ||
                errorEmail != "" ||
                errorPassword != ""
              }
              variant='primary'
              type='submit'
              className='w-100 py-2'
              style={{ backgroundColor: "#5883b0" }}>
              {!loggedInLoader && "Register"}
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
        <span>Already have an account? </span>
        <Link to='/login'>Login</Link>
      </div>
    </Container>
  );
}
