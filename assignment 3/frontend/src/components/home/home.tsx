import { NavLink } from "react-router";
import {Button} from 'react-bootstrap';

export default function Home() {
    return (
      <>
        <h1>Home</h1>
        <p>Welcome to the Home page!</p>
        <Button variant="primary">
          <NavLink to='/login'>Login</NavLink>
        </Button>
        <Button>
          <NavLink to='/register'>Register</NavLink>
        </Button>
      </>
    );
}