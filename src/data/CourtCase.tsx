import case_summaries from './case_summaries.json';

export enum Category {
  Desegregation = "Desegregation",
  CivilRights = "Civil Rights",
  Abortion = "Abortion",
  Elections = "Elections"
}

export function colorForCategory(cat: Category): string {
  switch (cat) {
    case Category.Desegregation:
      return "warning";
    case Category.CivilRights:
      return "secondary";
    case Category.Abortion:
      return "primary";
    case Category.Elections:
      return "danger";
  }
}

function categoryFromId(id: number): Category | null {
  switch (id) {
    case 159:
      return Category.Desegregation;
    case 154:
      return Category.CivilRights;
    case 423:
      return Category.Abortion;
    case 335:
      return Category.Elections;
    default:
      return null;
  }
}

export default class CourtCase {
  readonly plaintiff: string;
  readonly defendant: string;
  readonly category: Category | null;

  constructor(readonly docketNumber: string,
    title: string,
    categories: number[],
    readonly date: Date,
    readonly detailsURL: string,
    readonly description: string) {
    const { plaintiff, defendant } = splitTitle(title);
    this.plaintiff = plaintiff;
    this.defendant = defendant;

    this.category = null;
    for (const category of categories) {
      if (categoryFromId(category)) {
        this.category = categoryFromId(category);
      }
    }
    // some "safe" fallbacks
    if (this.category == null) {
      if (description.indexOf("abortion") !== -1) {
        this.category = Category.Abortion;
      }
    }
  }
}

export function splitTitle(title: string): { plaintiff: string, defendant: string } {
  if (title.indexOf(" v. ") === -1) {
    throw Error("Invalid title: " + title);
  }
  const [plaintiff, defendant] = title.split(" v. ");
  return { plaintiff, defendant };
}

export function getCases(): CourtCase[] {
  const cases = [];

  for (const caseObject of case_summaries) {
    if (!caseObject.description && caseObject.question) {
      caseObject.description = stripHtml(caseObject.question);
    }
    if (!caseObject.title || !caseObject.date || !caseObject.details_url || !caseObject.description) {
      continue;
    }
    if (caseObject.title.indexOf(" v. ") === -1) {
      continue;
    }
    cases.push(new CourtCase(
      caseObject.docket_number, caseObject.title,
      caseObject.categories,
      new Date(caseObject.date),
      caseObject.details_url, caseObject.description
    ));
  }

  cases.sort((c1, c2) => c1.date.getTime() - c2.date.getTime());
  cases.reverse();

  return cases;
}

// Quick little utility function to just get text from known safe HTML blobs
function stripHtml(html: string) : string {
   var tmp = document.createElement("div");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
