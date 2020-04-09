import React from 'react';
import {
  Container, Row, Col, Jumbotron,
  Navbar, NavbarBrand, Nav,
  Spinner,
  Form
} from "reactstrap";

import SearchBar from './components/SearchBar';
import { formatDate, getBadge } from './components/CaseCard';
import CaseDetails, { parseCaseDetails } from './data/CaseDetails';
import CourtCase from './data/CourtCase';

type CasePageProps = {
  courtCase: CourtCase
}

type CasePageState =
  | { isLoaded: false }
  | { isLoaded: true, error: object }
  | { isLoaded: true, error: null, caseDetails: CaseDetails };

export default class CasePage extends React.Component<CasePageProps, CasePageState> {
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
      const dateDescriptionList = (label: string, date: any): JSX.Element => date ?
        <>
          <dt className="col-sm-3">{label}</dt>
          <dd className="col-sm-9">{formatDate(date)}</dd>
        </> : <></>;

      const { category } = this.props.courtCase;
      const categoryBadge = category ? <>
        <dd className="col-sm-12">{getBadge(category)}</dd>
      </> : <></>;

      const { plaintiff, defendant, date_granted,
        date_argued, date_decided, decision, judges, conclusion } = this.state.caseDetails;

      body = <>
        <Container className="text-light bg-dark pt-4" fluid>
          <Container>
            <Row className="justify-content-center">
              <h1 className="font-weight-bold">
                {plaintiff} <span className="font-weight-light font-italic text-muted">v.</span> {defendant}
              </h1>
            </Row>
            <Row className="mt-4">
              <Col sm="12" md={{ size: 10, offset: 1 }}>
                <Jumbotron className="text-dark">
                  <dl className="row">
                    {categoryBadge}
                    {dateDescriptionList('Date Accepted', date_granted)}
                    {dateDescriptionList('Argued in Court', date_argued)}
                    {date_decided ?
                      <dd className="col-sm-12">
                        <p className="text-lead">
                          Decided on <span className="font-italic">{date_decided ? formatDate(date_decided) : ''}</span>
                          {decision
                            ? <>
                              {' '}in favor of <span className="font-weight-bold">{decision.winningParty}</span> with a
                            {' '}{decision.majorityVote}-{decision.minorityVote}
                            </>
                            : ''}.
                        </p>
                      </dd>
                      : ''}
                  </dl>
                  <hr className="my-4" />
                  <Row className="text-center justify-content-center">
                    {judges.map(j => j.renderPicture())}
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
                  Issue under Consideration</h2>
              </Row>
              <Row dangerouslySetInnerHTML={{ __html: this.state.caseDetails.factsOfTheCase }}>
              </Row>
              {conclusion ?
                <>
                  <Row className="justify-content-center">
                    <h2 className="font-weight-bold">
                      Conclusion</h2>
                  </Row>
                  <Row dangerouslySetInnerHTML={{ __html: conclusion }}></Row>
                </> : <></>
              }
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
          <SearchBar />
        </Form>
      </Navbar>

      {body}
    </>;
  }
}
