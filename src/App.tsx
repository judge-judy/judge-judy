import React from 'react';
import {
  HashRouter as Router,
  Switch, Route
} from "react-router-dom";
import {
  Container, Row, Col,
  Form, Input, Button
} from "reactstrap";
import Octicon, { Search } from '@primer/octicons-react';

import { getCases } from './data/CourtCase';
import CaseSummaryCard from './components/CaseCard';
import './App.css';


const cases = getCases();


class HomePage extends React.Component<{}, {}> {
  render() {
    return <>
      <Container id="header" className="bg-light text-center py-5" fluid>
        <h1 className="display-1">
          Judge Judy
          </h1>
        <p className="text-muted lead">The Supreme Court made accessible.</p>
      </Container>

      <Container id="home-search" className="bg-dark text-center py-3" fluid>
        <p className="lead text-light">
          Search by issues, judges, parties, etc.
        </p>
        <Form className="justify-content-center" inline>
          <Input className="form-control mr-sm-2" type="search" name="search" id="searchQuery" placeholder="Search for case..." />
          <Button>Search <Octicon icon={Search} /></Button>
        </Form>
      </Container>

      <Container>
        <Row className="mt-3">
          <Col>
            <h2>Cases awaiting Arguments</h2>
            
            <CaseSummaryCard courtCase={cases[0]} />
          </Col>
          <Col>
            <h2>Cases by Topic</h2>
          </Col>
        </Row>
      </Container>
    </>;
  }
}

// {} types for both props and state so far...
class App extends React.Component<{}, {}> {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
