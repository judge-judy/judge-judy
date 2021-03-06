import React, { FunctionComponent } from 'react';
import {
  HashRouter as Router,
  Switch, Route, useParams
} from "react-router-dom";
import {
  Container, Row, Col,
  Button, Form,
  Card, CardBody, CardTitle, CardText,
  UncontrolledCollapse
} from "reactstrap";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';

import CourtCase, { getCases, colorForCategory, Category } from './data/CourtCase';
import CasePage from './CasePage';
import SearchBar from './components/SearchBar';
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
                <SearchBar />
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
      return `The U.S has had a long history of discrimination in terms of both races
        and gender. These are some of the landmark cases that track the
        legal issues around this topic.`;
    case Category.CivilRights:
      return `The bill of rights covers are a rich set of inalienable rights provided
        to people in America. These cases revolve around the limitations and
        enforcement of these rights.`;
    case Category.Abortion:
      return `Abortion has been a hotly contested issue within America. With wide laws
        criminimalizing it in the 1800s and 1900s, steps towards and away from
        the right to abortion have been made.`;
    case Category.Elections:
      return `Elections are a core part of our democracy. The laws that govern
        campaigns, election spending, term limits are explored in these themed
        cases.`;
  }
}

const getCasesForCategory = (category: Category): CourtCase[] => {
  switch (category) {
    case Category.Desegregation:
      return ['163us537', '347us483', '84-6263'].map(id => casesById.get(id));
    case Category.CivilRights:
      return ['492', '88-155', '94-329'].map(id => casesById.get(id));
    case Category.Abortion:
      return ['70-18', '99-830', '15-274'].map(id => casesById.get(id));
    case Category.Elections:
      return ['75-436', '08-205'].map(id => casesById.get(id));
  }
}

type CategoryExpanderProps = { category: Category }
const CategoryExpander: FunctionComponent<CategoryExpanderProps> = ({ category }: CategoryExpanderProps) => {
  const uniqueID = `view-${category.replace(' ', '-')}`;
  
  const description = getCategoryDescription(category);
  const cases = getCasesForCategory(category);

  return <>
    <Card className="mt-4" outline color={colorForCategory(category)}>
      <CardBody>
        <CardTitle tag="h5">{category}</CardTitle>
        <CardText>{description}</CardText>
        <Button id={uniqueID}>View Cases</Button>
      </CardBody>
    </Card>
    <UncontrolledCollapse toggler={`#${uniqueID}`}>
      { cases.map(c => <CaseSummaryCard key={c.docketNumber} outline={colorForCategory(category)} courtCase={c} />) }
    </UncontrolledCollapse>
  </>;
}

const searchClient = algoliasearch(
  '79H8GR8U9A',
  '1b2d0670ff0df398224e31d9b0ab97de'
);

// {} types for both props and state so far...
class App extends React.Component<{}, {}> {
  render() {
    return (
      <InstantSearch indexName="judge_judy" searchClient={searchClient}>
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
      </InstantSearch>
    );
  }
}

export default App;
