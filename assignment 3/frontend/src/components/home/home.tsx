import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState<string>("");

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log(search);
  }

  return (
    <Container className='text-center'>
      <Form>
        <Form.Group
          className='mb-3 mt-5 w-75 d-inline-flex'
          controlId='exampleForm.ControlInput1'>
          <Form.Control
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Please enter an artist name.'
          />
          <Button
            variant='primary'
            disabled={search == "" ? true : false}
            type='submit'
            style={{ borderRadius: 0 }}
            onClick={(e) => handleSubmit(e)}>
            Submit
          </Button>
          <Button
            variant='secondary'
            disabled={search == "" ? true : false}
            onClick={() => setSearch("")}
            style={{ borderRadius: "0 5px 5px 0" }}>
            Clear
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}
