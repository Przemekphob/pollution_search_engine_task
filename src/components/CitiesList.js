import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Table } from 'semantic-ui-react';

const CitiesList = props => {
  const citiesList = props.allData.map((city, index) => {
    return (
      <Table.Row key = {index}>
        <Table.Cell>{city.city}</Table.Cell>
        <Table.Cell>{city.location}</Table.Cell>
        <Table.Cell>{city.count}</Table.Cell>
        <Table.Cell>{city.description}</Table.Cell>
      </Table.Row>
    )
  });

  if (props.allData.length === 0) {
    return <table></table>
  } else {
    return (
        <Table inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>City:</Table.HeaderCell>
              <Table.HeaderCell>Location:</Table.HeaderCell>
              <Table.HeaderCell>Count:</Table.HeaderCell>
              <Table.HeaderCell>Description:</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {citiesList}
          </Table.Body>
        </Table>
    );
  }
}

export default CitiesList;
