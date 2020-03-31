import React from 'react';
import {
  HashRouter as Router,
  Switch, Route, useParams
} from "react-router-dom";
import {
  Container, Row, Col, Jumbotron,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
  Navbar, NavbarBrand,
  Spinner,
  Nav
} from "reactstrap";
import Octicon, { Search } from '@primer/octicons-react';

import CaseDetails, { parseCaseDetails } from './data/CaseDetails';
import CourtCase, { getCases } from './data/CourtCase';
import CaseSummaryCard, { formatDate } from './components/CaseCard';
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
          </Col>
        </Row>
      </Container>
    </>;
  }
}

type CasePageProps = {
  courtCase: CourtCase
}

type CasePageState =
  | { isLoaded: false }
  | { isLoaded: true, error: object }
  | { isLoaded: true, error: null, caseDetails: CaseDetails };

class CasePage extends React.Component<CasePageProps, CasePageState> {
  constructor(props: CasePageProps) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch(this.props.courtCase.detailsURL)
      .then(res => res.json())
      .then(
        res => {
          this.setState({ isLoaded: true, caseDetails: parseCaseDetails(res) });
        },
        error => {
          this.setState({ isLoaded: true, error });
        }
      );
  }

  render() {
    let body;
    if (!this.state.isLoaded) {
      body = <Spinner></Spinner>;
    }
    else if (this.state.error) {
      body = <p>Error? {this.state.error}</p>;
    }
    else {
      const dateDescriptionList = (label : string, date: any) : JSX.Element => date ?
        <>
          <dt className="col-sm-3">{ label }</dt>
          <dd className="col-sm-9">{ formatDate(date) }</dd>
        </> : <></>;

      const { plaintiff, defendant, date_granted, 
              date_argued, date_decided, decision, judges } = this.state.caseDetails;

      body = <>
      <Container className="text-light bg-dark pt-4" fluid>
        <Container>
          <Row className="justify-content-center">
            <h1 className="font-weight-bold">
              { plaintiff } <span className="font-weight-light font-italic text-muted">v.</span> { defendant }
            </h1>
          </Row>
          <Row className="mt-4">
            <Col sm="12" md={{ size: 10, offset: 1 }}>
              <Jumbotron className="text-dark">
                <dl className="row">
                  { dateDescriptionList('Date Accepted', date_granted) }
                  { dateDescriptionList('Argued in Court', date_argued) }
                  { date_decided ?
                  <dd className="col-sm-12">
                    <p className="text-lead">
                      Decided on <span className="font-italic">{ date_decided ? formatDate(date_decided) : '' }</span>
                      { decision
                        ? <>
                            {' '}in favor of <span className="font-weight-bold">{decision.winningParty}</span> with a
                            {' '}{decision.majorityVote}-{decision.minorityVote}
                          </>
                        : '' }.
                    </p>
                  </dd>
                  : ''}
                </dl>
                <hr className="my-4" />
                <Row className="text-center justify-content-center">
                { judges.length > 0
                  ? judges.map(j => j.renderPicture())
                  : ''
                }
                </Row>
              </Jumbotron>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container className="text-dark bg-light pt-4" fluid>
        <Container>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <Row className="justify-content-center">
              <h2 className="font-weight-bold">
                Issue under Consideration
              </h2>
            </Row>
            <Row dangerouslySetInnerHTML={{__html: this.state.caseDetails.factsOfTheCase}}>
            </Row>
          </Col>
        </Container>
      </Container>
      </>;
    }


    return <>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="#">
          <h4 className="display-4">
            Judge Judy
          </h4>
        </NavbarBrand>
        <Nav className="mr-auto" navbar></Nav>
        <Form inline>
          <InputGroup>
            <Input className="form-control" type="search" name="search" id="searchQuery" placeholder="Search for case..." />
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <Octicon icon={Search} verticalAlign='middle' size='small'></Octicon>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      </Navbar>

      {body}
    </>;
  }
}

function CasePageRouter() {
  const { docketId } = useParams();
  return <CasePage courtCase={casesById.get(docketId)} />
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
