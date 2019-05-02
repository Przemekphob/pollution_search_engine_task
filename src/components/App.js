import React from 'react';
import axios from 'axios';
import { Container, Header, Divider, Icon, List, Segment } from 'semantic-ui-react';

import SearchBar from './SearchBar';
import CitiesList  from './CitiesList';

class App extends React.Component {
  state = {
    cities: [] || '',
    descriptions: [] || '',
    allData: [] || ''
  };

  onSearchSubmit = async (term) => {
    this.setState({ cities: [], description: [], allData: []})
    const response = await axios.get(`https://api.openaq.org/v1/locations?country=${term}&order_by=count&sort=desc&limit=10`, 'utf8');

    this.setState({ cities: response.data.results });

    this.state.cities.map(city => {
      return (
        axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${city.city}&origin=*`, 'utf8').then(res => {
          const descAll = this.state.descriptions;
          const description = res.data[2][0] === '' ? "No wikipedia description" : res.data[2][0];

          descAll[city.city] = description;

          this.setState({ descriptions: descAll });

          const result = this.state.cities.map((city) => { return {
            city: city.city,
            location: city.location,
            count: city.count,
            description: this.state.descriptions[city.city]
          }});
          this.setState({ allData: result })
        })
      )
    });
  }

  componentWillMount() {
    localStorage.getItem('previousSessionAllData') && this.setState({
      allData: JSON.parse(localStorage.getItem('previousSessionAllData'))
    })
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('previousSessionAllData', JSON.stringify(nextState.allData));
  }

  render() {
    return (
      <Container textAlign='justified'>
        <Segment inverted>
          <Header inverted as='h1'>
            <Icon name='settings' />
            <Header.Content>
              Most polluted cities
              <Header.Subheader>search engine</Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Divider />
        <Segment inverted>
          <List>
            <List.Item>
              <List.Icon name='angle double right' />
              <List.Content>Poland</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='angle double right' />
              <List.Content>Germany</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='angle double right' />
              <List.Content>Spain</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='angle double right' />
              <List.Content>France</List.Content>
            </List.Item>
          </List>
        </Segment>
        <Divider />
        <SearchBar onSubmit = {this.onSearchSubmit} />
        <Divider />
        <Segment inverted>
          <Header size='medium'>Foud total records: {this.state.allData.length} most polluted cities</Header>
        </Segment>
        <Divider />
        <CitiesList allData = {this.state.allData} />
        <Divider />
      </Container>
    );
  }
}

export default App;
