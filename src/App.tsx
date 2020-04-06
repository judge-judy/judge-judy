import React, { FunctionComponent } from 'react';
import {
  HashRouter as Router,
  Switch, Route, useParams
} from "react-router-dom";
import {
  Container, Row, Col,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
} from "reactstrap";
import Octicon, { Search } from '@primer/octicons-react';

import { getCases, Category } from './data/CourtCase';
import CasePage from './CasePage';
import CaseSummaryCard from './components/CaseCard';
import './App.css';


const cases = getCases();
// A map with docket ids -> cases
const casesById = new Map();
cases.forEach(c => casesById.set(c.docketNumber, c));
// A little hacky but for now, since the summaries don't contain the date
// argued we just use a > certain_date filter.
const newCases = cases;
//const newCases = cases.filter(c => c.date > new Date('November 1, 2019 00:00:00'))


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
              newCases.slice(0, 5).map(c => <CaseSummaryCard key={c.docketNumber} courtCase={c} />)
            }
          </Col>
          <Col md="6">
            <h2>Cases by Topic</h2>
            <CategoryExpander category={Category.Desegregation}></CategoryExpander>
            <CategoryExpander category={Category.CivilRights}></CategoryExpander>
            <CategoryExpander category={Category.Abortion}></CategoryExpander>
            <CategoryExpander category={Category.Elections}></CategoryExpander>
          </Col>
        </Row>
      </Container>
    </>;
  }
}

function CasePageRouter() {
  const { docketId } = useParams();
  return <CasePage courtCase={casesById.get(docketId)} />
}

const getCategoryDescription = (category: Category) => {
  switch (category) {
    case Category.Desegregation:
      return <></>;
    case Category.CivilRights:
      return <></>;
    case Category.Abortion:
      return <></>;
    case Category.Elections:
      return <></>;
  }
}

type CategoryExpanderProps = { category: Category }
const CategoryExpander: FunctionComponent<CategoryExpanderProps> = ({ category }: CategoryExpanderProps) => {
  const description = getCategoryDescription(category);
  return description;
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
          <Route path="/cases/:docketId">
            <CasePageRouter />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
