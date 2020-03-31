import React, { FunctionComponent } from 'react';
import { Card, CardTitle, CardText, Badge } from 'reactstrap';
import { Link } from "react-router-dom";
import CourtCase from '../data/CourtCase';

type CaseSummaryProps = {
    courtCase: CourtCase
}

export const formatDate = (d: Date) => {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    
    return `${da} ${mo}, ${ye}`;
}

const CaseSummaryCard: FunctionComponent<CaseSummaryProps> = ({courtCase} : CaseSummaryProps) => {
    const {plaintiff, defendant, date, description, docketNumber} = courtCase;

    return <Card className="my-2" body>
        <CardTitle tag="h5">
            { plaintiff } <span className="font-weight-bold font-italic">v.</span> { defendant }
        </CardTitle>
        <div className="clearfix mb-3">
            <span className="text-muted">{ formatDate(date) }</span>
            <Badge className="float-right" color="secondary">Civil Rights</Badge>
        </div>
        <CardText>
            { description }
        </CardText>
        <Link to={`/cases/${docketNumber}`}>Read More...</Link>
    </Card>;
}

export default CaseSummaryCard;
