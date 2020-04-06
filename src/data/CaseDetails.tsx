import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { splitTitle } from './CourtCase';


export class Judge {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly thumbnailURL: string,
    readonly voted: 'majority' | 'minority' | 'not-voted-yet',
  ) { }

  public renderPicture(key = '') {
    let imageClass = 'judge-image rounded-circle border';
    if (this.voted === 'majority') {
      imageClass += ' border-success';
    } else if (this.voted === 'minority') {
      imageClass += ' border-danger';
    }
    return <div key={this.id}>
      <img alt={`Justice ${this.name}`} id={this.id}
        src={this.thumbnailURL} className={imageClass} />
      <UncontrolledTooltip target={this.id} placement="top" >
        {this.name}
      </UncontrolledTooltip>
    </div>;
  }
}

export class Decision {
  constructor(
    readonly winningParty: string,
    readonly majorityVote: number,
    readonly minorityVote: number
  ) { }
}

export default class CaseDetails {
  constructor(
    readonly plaintiff: string,
    readonly defendant: string,
    readonly factsOfTheCase: string,
    readonly conclusion: string | null,
    readonly date_granted: Date | null,
    readonly date_argued: Date | null,
    readonly date_decided: Date | null,
    readonly decision: Decision | null,
    readonly judges: Judge[]
  ) { }
}

export function parseCaseDetails(api_blob: any): CaseDetails {
  const { plaintiff, defendant } = splitTitle(api_blob.name);
  let date_granted = null;
  let date_argued = null;
  let date_decided = null;
  for (const timelineEvent of api_blob.timeline) {
    switch (timelineEvent.event) {
      case "Granted":
        date_granted = new Date(timelineEvent.dates[0] * 1000);
        break;
      case "Argued":
        date_argued = new Date(timelineEvent.dates[0] * 1000);
        break;
      case "Decided":
        date_decided = new Date(timelineEvent.dates[0] * 1000);
        break;
    }
  }

  let decision = null;
  let judges = [];
  if (api_blob.decisions && api_blob.decisions.length >= 1) {
    const d = api_blob.decisions[api_blob.decisions.length - 1];

    decision = new Decision(d.winning_party, d.majority_vote, d.minority_vote);
    judges = d.votes.map(
      (j: any) => new Judge(j.member.identifier, j.member.name, j.member.thumbnail.href, j.vote)
    );
  }

  if (api_blob.heard_by[0] && api_blob.heard_by[0].members && judges.length === 0) {
    judges = api_blob.heard_by[0].members.map(
      (j: any) => new Judge(j.identifier, j.name, j.thumbnail.href, "not-voted-yet")
    );
  }

  return new CaseDetails(
    plaintiff, defendant, api_blob.facts_of_the_case ? api_blob.facts_of_the_case : '',
    api_blob.conclusion ? api_blob.conclusion : null,
    date_granted, date_argued, date_decided,
    decision,
    judges
  );
}
