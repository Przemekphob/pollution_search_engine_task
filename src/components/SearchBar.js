import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

class SearchBar extends React.Component {
  state = { term: ''};

  onFormSubmit = event => {
    event.preventDefault();

    switch (this.state.term) {
      case 'Poland':
        this.props.onSubmit("PL");
        break;
        case 'Germany':
          this.props.onSubmit("DE");
          break;
        case 'Spain':
          this.props.onSubmit("ES");
          break;
        case 'France':
          this.props.onSubmit("FR");
          break;
      default:
          this.props.onSubmit();
    }
  }

  componentWillMount() {
    localStorage.getItem('previousSessionInput') && this.setState({
      term: JSON.parse(localStorage.getItem('previousSessionInput'))
    })
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('previousSessionInput', JSON.stringify(nextState.term));
  }

  render() {
    return  (
      <Segment inverted>
        <Form inverted onSubmit = {this.onFormSubmit}>
          <Form.Field>
            <Form.Input
              fluid
              label='Please type one of four options, case sensitive, and press enter:'
              list="mylist"
              icon='search'
              placeholder='Search...'
              type = "text"
              value = {this.state.term}
              onChange = { e => this.setState({term: e.target.value}) }
            />
            <datalist id='mylist'>
              <option>Poland</option>
              <option>Germany</option>
              <option>Spain</option>
              <option>France</option>
            </datalist>
          </Form.Field>
          <Button type='submit'>Submit</Button>
        </Form>
      </Segment>
    );
  }
}

export default SearchBar;
