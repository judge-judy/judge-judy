import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CaseSummaryCard from './CaseCard';
import CourtCase from '../data/CourtCase';

test('renders all the required elements', () => {
  const courtCase = new CourtCase(
    "docket-id", "NRA v. New York", [], new Date('December 17, 1995 03:24:00'),
    "http://example.com", "This case relates to issues..."
  );
  const { getAllByText, getByText } = render(
    <MemoryRouter>
      <CaseSummaryCard courtCase={courtCase} />
    </MemoryRouter>
  );
  expect(getAllByText(/NRA/i)).toBeTruthy();
  expect(getAllByText(/New York/i)).toBeTruthy();
  expect(getByText("17 Dec, 1995")).toBeInTheDocument();
  expect(getByText("This case relates to issues...")).toBeInTheDocument();
});

test('points the link to the right place', () => {
  const courtCase = new CourtCase(
    "docket-id", "NRA v. New York", [], new Date('December 17, 1995 03:24:00'),
    "http://example.com", "This case relates to issues..."
  );
  const { getByText } = render(
    <MemoryRouter>
      <CaseSummaryCard courtCase={courtCase} />
    </MemoryRouter>
  );
  const link = getByText('Read More...');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/cases/docket-id');
});
