import React, {
  FC, useRef, useState,
} from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import { apiGet } from '~/client/util/apiv1-client';

type ITagsSearch = {
  ok: boolean,
  tags: string[]
}

type TypeaheadInstance = {
  focus: () => void,
  _handleMenuItemSelect: (activeItem: string, e: React.ChangeEvent<HTMLInputElement>) => void,
  state: {
    initialItem: string,
  },
}

type Props = {
  tags: string[],
  onTagsUpdated: (tags: string[]) => void,
  autoFocus: boolean
}

const TagsInput: FC<Props> = (props: Props) => {

  const tagsInputRef = useRef<TypeaheadInstance>(null);

  const [resultTags, setResultTags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [selected, setSelected] = useState(props.tags);

  const handleChange = (selected) => {
    setSelected(selected);

    if (props.onTagsUpdated != null) {
      props.onTagsUpdated(selected);
    }
  };

  const handleSearch = async(query) => {
    setLoading(true);
    try {
      const res = await apiGet('/tags.search', { q: query }) as ITagsSearch;
      res.tags.unshift(query);
      setResultTags(Array.from(new Set(res.tags)));
    }
    catch (err) {
      //
    }
    finally {
      setLoading(false);
    }
  };

  const handleSelect = (e) => {
    if (e.keyCode === 32 || e.keyCode === 13) { // '32' means ASCII code of 'space'
      e.preventDefault();

      const initialItem = tagsInputRef?.current?.state?.initialItem;
      const handleMenuItemSelect = tagsInputRef?.current?._handleMenuItemSelect;

      if (initialItem != null && handleMenuItemSelect != null) {
        handleMenuItemSelect(initialItem, e);
      }
    }
  };

  return (
    <div className="tag-typeahead">
      <AsyncTypeahead
        id="tag-typeahead-asynctypeahead"
        ref={tagsInputRef}
        caseSensitive={false}
        defaultSelected={props.tags ?? []}
        isLoading={isLoading}
        minLength={1}
        multiple
        newSelectionPrefix=""
        onChange={handleChange}
        onSearch={handleSearch}
        onKeyDown={handleSelect}
        options={resultTags} // Search result (Some tag names)
        placeholder="tag name"
        autoFocus={props.autoFocus}
      />
    </div>
  );
};

export default TagsInput;
