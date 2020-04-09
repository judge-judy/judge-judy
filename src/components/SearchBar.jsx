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
import { useHistory } from "react-router-dom";
import Octicon, { Search } from '@primer/octicons-react';

const AutoComplete = connectAutoComplete(({ hits, currentRefinement, refine }) => {
  const history = useHistory();
  return <>
    <Configure hitsPerPage={5} />
    <Autosuggest
      suggestions={hits}
      onSuggestionsFetchRequested={({ value }) => refine(value)}
      onSuggestionsClearRequested={() => refine('')}
      getSuggestionValue={hit => hit.name}
      renderSuggestion={hit =>
        <>
          <Highlight hit={hit} attribute="title" /><br />
          <span className="text-muted">{hit.date_timestamp}</span><br />
          <Snippet hit={hit} attribute="question" />
        </>
      }
      inputProps={{
        placeholder: 'Search for case...',
        value: currentRefinement,
        onChange: () => { }
      }}
      onSuggestionSelected={(event, { suggestion, suggestionValue }) => {
        const docketId = suggestion.objectID;
        history.push(`/cases/${docketId}`);
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
}
);

export default AutoComplete;
