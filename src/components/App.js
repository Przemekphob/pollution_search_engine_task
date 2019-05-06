import React from 'react';
import axios from 'axios';
import { Container, Header, Divider, Icon, List, Segment } from 'semantic-ui-react';

import SearchBar from './SearchBar';
import CitiesList  from './CitiesList';

class App extends React.Component {
  state = {
    cities: [] || '',
    allData: [] || ''
  };

  onSearchSubmit = async (term) => {
    this.setState({ cities: [], description: [], allData: []});

    const response = await axios.get(`https://api.openaq.org/v1/locations?country=${term}&order_by=count&sort=desc&limit=10`, 'utf8');
    let cities = response.data.results;

    let allData = cities.map((city) => {
      return {
        city: city.city,
        location: city.location,
        count: city.count,
        description: 'downloading...'
      }
    });
    this.setState({ allData: allData, cities: cities });

    cities = await Promise.all(
      cities.map(city => axios.get(`https://en.wikipedia.org/w/api.php`, {
          params: {
            action: 'query',
            format: 'json',
            list: 'search',
            srsearch: city.city.replace(/[()]/g, '') + ' insource:"infobox settlement"',
            origin: '*'
          }
        }, 'utf8')
        .then(res => {
          let pageid = res.data.query.search[0].pageid;
          city.pageid = pageid;

          return city;
        })
      )
    )

    let pageids = cities.map(city => city.pageid);
    await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        exsentences: 1,
        exintro: true,
        explaintext: true,
        exsectionformat: 'plain',
        pageids: pageids.join('|'),
        redirects: 1,
        uselang: 'en',
        origin: '*'
      }
    }).then(res => {
      let searchresults = res.data.query.pages;

      Object.keys(searchresults).map(searchresult => Object.keys(cities).map(city => {
          if (searchresult == cities[city].pageid) {
            cities[city].description = searchresults[searchresult].extract;
          }
        })
      )
    });

    allData = cities.map(city => {
      return {
        city: city.city,
        location: city.location,
        count: city.count,
        description: city.description
      }
    });
    this.setState({ allData: allData, cities: cities });
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
