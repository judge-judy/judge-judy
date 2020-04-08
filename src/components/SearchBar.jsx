import React from 'react';
import Autosuggest from 'react-autosuggest';
import {
  Highlight,
  Snippet,
  Configure,
  connectAutoComplete,
} from 'react-instantsearch-dom';
import {
  InputGroup, Input, InputGroupAddon, InputGroupText
} from 'reactstrap';
import Octicon, { Search } from '@primer/octicons-react';

const AutoComplete = connectAutoComplete(
  ({ hits, currentRefinement, refine }) => (
    <>
    <Configure hitsPerPage={5} />
    <Autosuggest
      suggestions={hits}
      onSuggestionsFetchRequested={({ value }) => refine(value)}
      onSuggestionsClearRequested={() => refine('')}
      getSuggestionValue={hit => hit.name}
      renderSuggestion={hit =>
        <>
          <Highlight hit={hit} attribute="title" /><br/>
          <span class="text-muted">{hit.date_timestamp}</span><br/>
          <Snippet hit={hit} attribute="question" />
        </>
      }
      inputProps={{
        placeholder: 'Search for case...',
        value: currentRefinement,
        onChange: () => {},
      }}
      renderInputComponent={inputProps => (
        <InputGroup className="w-100" size="md">
        <Input {...inputProps} className="form-control" type="search" name="search" id="searchQuery" placeholder="Search for case..." />
        <InputGroupAddon addonType="append">
          <InputGroupText>
            <Octicon icon={Search} verticalAlign='middle' size='small'></Octicon>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>)
      }
    />
    </>
  )
);

export default AutoComplete;
