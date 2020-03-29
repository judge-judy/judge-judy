import React from 'react';
import {
  HashRouter as Router,
  Switch, Route
} from "react-router-dom";
import {
  Container, Row, Col,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
  Button
} from "reactstrap";
import Octicon, { Search } from '@primer/octicons-react';

import { getCases } from './data/CourtCase';
import CaseSummaryCard from './components/CaseCard';
import './App.css';


const cases = getCases();
// A little hacky but for now, since the summaries don't contain the date
// argued we just use a > certain_date filter.
const newCases = cases.filter(c => c.date > new Date('November 1, 2019 00:00:00'))


class HomePage extends React.Component<{}, {}> {
  render() {
    return <>
      <Container id="header" className="bg-light text-center py-5" fluid>
        <h1 className="display-1">
          Judge Judy
          </h1>
        <p className="text-muted lead">The Supreme Court made accessible.</p>
      </Container>

      <Container id="home-search" className="bg-dark text-center text-light py-3" fluid>
        <p className="lead">
          Search by issues, judges, parties, etc.
        </p>
        <Container>
          <Row>
            <Col sm="12" md={{ size: 4, offset: 4 }}>
              <Form className="justify-content-center" inline>
                <InputGroup className="w-100" size="md">
                  <Input className="form-control" type="search" name="search" id="searchQuery" placeholder="Search for case..." />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <Octicon icon={Search} verticalAlign='middle' size='small'></Octicon>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </Container>

      <Container>
        <Row className="mt-3">
          <Col md="6">
            <h2>Cases awaiting Arguments</h2>
            {
              newCases.slice(0, 5).map(c => <CaseSummaryCard courtCase={c} />) 
            }
          </Col>
          <Col md="6">
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
