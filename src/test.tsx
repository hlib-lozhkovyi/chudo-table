import React from 'react';
import ChudoTable, { DataSource, Table, Columns, Column, SelectColumn, ActionColumn, Pagination } from 'index';

interface User {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const Test = () => {
  const fetcher = (): Promise<User[]> => fetch('https://reqres.in/api/users?page=2')
    .then(response => response.json())
    .then(result => result.data)
    .catch(error => console.error(error));

  return (
    <ChudoTable idAccessor="id">
      <DataSource fetcher={fetcher} />
      <Table>
        <Columns>
          <SelectColumn accessor="id" />
          <Column accessor="avatar" Header="Avatar">
            {({ avatar }) => <img src={avatar} style={{ width: 22, height: 22, borderRadius: '50%' }} />}
          </Column>
          <Column accessor="email" Header="Email" />
          {/* <ActionColumn>
            {({ id }) =>
              <>
                <button onClick={() => alert(`delete ${id}`)}>Delete</button>
                <button onClick={() => alert(`edit ${id}`)}>Edit</button>
              </>
            }
          </ActionColumn> */}
        </Columns>
      </Table>
      <Pagination />
    </ChudoTable >
  )
}