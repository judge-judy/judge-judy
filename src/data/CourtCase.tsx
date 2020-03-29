import case_summaries from './case_summaries.json';

export default class CourtCase {
    readonly plaintiff: string;
    readonly defendant: string;

    constructor(readonly docketNumber: string,
                title: string,
                readonly date: Date,
                readonly detailsURL: string,
                readonly description: string) {
        if (title.indexOf(" v. ") === -1) {
            throw Error("Invalid title: " + title);
        }
        [this.plaintiff, this.defendant] = title.split(" v. ");
    }
}

export function getCases() : CourtCase[] {
    const cases = [];

    for (const caseObject of case_summaries) {
        if (!caseObject.title || !caseObject.date || !caseObject.details_url || !caseObject.description) {
            continue;
        }
        if (caseObject.title.indexOf(" v. ") === -1) {
            continue;
        }
        cases.push(new CourtCase(
            caseObject.docket_number, caseObject.title, 
            new Date(caseObject.date), 
            caseObject.details_url, caseObject.description
        ));
    }

    cases.sort((c1, c2) => c1.date.getTime() - c2.date.getTime());
    cases.reverse();
    
    return cases;
}
