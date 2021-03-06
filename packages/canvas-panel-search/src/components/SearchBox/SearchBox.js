import React, { Component } from 'react';
import { withBemClass } from '@canvas-panel/core';
import { connect } from 'react-redux';
import './SearchBox.scss';
import {
  searchCancel,
  searchNextCanvas,
  searchPrevCanvas,
  searchRequest,
} from '../../redux/search';
import { selectSearchState } from '../../redux/search.selectors';

class SearchBox extends Component {
  input = null;

  state = { open: false };

  pressEscape = e => {
    if (e.keyCode === 27) {
      if (this.input && this.state.open) {
        this.input.value = '';
        this.props.dispatch(searchCancel());
        this.setState({ open: false });
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.pressEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.pressEscape);
  }

  openSearch = () => {
    if (!this.state.open) {
      setTimeout(() => this.input.focus(), 120);
    } else {
      this.input.value = '';
      this.props.dispatch(searchCancel());
    }
    this.setState({ open: !this.state.open });
  };

  handleKeyPress = e => {
    if (e.keyCode === 13) {
      // ENTER
      this.props.dispatch(searchRequest({ q: this.input.value }));
    }
  };

  render() {
    const {
      bem,
      searchAvailable,
      currentQuery,
      highlights,
      currentHighlight,
    } = this.props;

    if (!searchAvailable) {
      return <div />;
    }

    return (
      <div className={bem.modifiers({ open: this.state.open })}>
        <button
          className={`${bem.element('search-icon')} material-icons`}
          onClick={this.openSearch}
        >
          {this.state.open ? 'close' : 'search'}
        </button>
        <div
          className={bem.element('container')}
          style={{ position: 'relative' }}
        >
          <input
            ref={input => (this.input = input)}
            onKeyUp={this.handleKeyPress}
            placeholder="Enter keywords"
            className={bem.element('input')}
            type="text"
          />
          {currentQuery ? (
            <span className={bem.element('results-label')}>
              {`${currentHighlight + 1} of ${highlights.length}`}
            </span>
          ) : null}
          <button
            className={`${bem.element('button').modifiers({
              disabled: !currentQuery || currentHighlight === 0,
            })} material-icons`}
            onClick={() => this.props.dispatch(searchPrevCanvas())}
          >
            arrow_back
          </button>
          <button
            className={`${bem.element('button').modifiers({
              disabled:
                !currentQuery || currentHighlight + 1 === highlights.length,
            })} material-icons`}
            onClick={() => this.props.dispatch(searchNextCanvas())}
          >
            arrow_forward
          </button>
        </div>
      </div>
    );
  }
}

export default connect(selectSearchState)(
  withBemClass('search-box')(SearchBox)
);
