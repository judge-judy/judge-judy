import React, { FunctionComponent } from 'react';
import { Card, CardTitle, CardText, Badge } from 'reactstrap';
import { Link } from "react-router-dom";
import CourtCase, { Category, colorForCategory } from '../data/CourtCase';

type CaseSummaryProps = {
  courtCase: CourtCase,
  outline?: string
}

export const formatDate = (d: Date) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

  return `${da} ${mo}, ${ye}`;
}

export const getBadge = (c: Category | null, className = '') => {
  if (c == null) {
    return <></>;
  }
  return <Badge className={className} color={colorForCategory(c)}>{c}</Badge>;
}

const CaseSummaryCard: FunctionComponent<CaseSummaryProps> = ({ courtCase, outline }: CaseSummaryProps) => {
  const { plaintiff, defendant, date, description, docketNumber } = courtCase;

  let outlineProps = {};
  if (outline) {
    outlineProps = {'outline': true, 'color': outline};
  }

  return <Card className="my-2" body {...outlineProps}>
    <CardTitle tag="h5">
      {plaintiff} <span className="font-weight-bold font-italic">v.</span> {defendant}
    </CardTitle>
    <div className="clearfix mb-3">
      <span className="text-muted">{formatDate(date)}</span>
      {getBadge(courtCase.category, "float-right")}
    </div>
    <CardText>
      {description}
    </CardText>
    <Link to={`/cases/${docketNumber}`}>Read More...</Link>
  </Card>;
}

export default CaseSummaryCard;
