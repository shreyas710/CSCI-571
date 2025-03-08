import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";
export default function Home() {
  const [search, setSearch] = useState<string>('');

    return (
      <Container>
        <Form>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
            name='artist'
            type='text'
            id='search-bar'
            className='search-bar w-75 mt-5'
            placeholder='Please enter an artist name.'
          />
          <Button disabled={search == '' ? true : false} className="border-1">Search</Button>
          <Button disabled={search == '' ? true : false} variant="secondary" onClick={() => setSearch('')}>Clear</Button>
        </Form>
      </Container>
    );
}