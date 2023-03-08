import React from 'react';
import ChudoTable, {
  DataSource,
  DataTransformer,
  Table,
  Columns,
  Column,
  SelectColumn,
  ActionColumn,
  Pagination,
  DataFetcherPropsInterface
} from 'index';

interface User {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export const Test = () => {
  const fetcher = ({ page }: DataFetcherPropsInterface): Promise<User[]> => {
    return fetch(`https://reqres.in/api/users?page=${page}`)
      .then(response => response.json())
  }

  return (
    <ChudoTable idAccessor="id">
      <DataSource fetcher={fetcher} />
      <DataTransformer<User, UserResponse>
        getData={(response) => response.data}
      />
      <Table>
        <Columns>
          <SelectColumn accessor="id" />
          <Column accessor="avatar" Header="Avatar">
            {({ avatar }) => <img src={avatar} style={{ width: 22, height: 22, borderRadius: '50%' }} />}
          </Column>
          <Column accessor="email" Header="Email" />
          <ActionColumn>
            {({ id }) =>
              <>
                <button onClick={() => alert(`delete ${id}`)}>Delete</button>
                <button onClick={() => alert(`edit ${id}`)}>Edit</button>
              </>
            }
          </ActionColumn>
        </Columns>
      </Table>
      <Pagination<User, UserResponse>
        pageSize={6}
        getTotalCount={(response) => response.total}
        getTotalPages={(response) => response.total_pages}
      />
    </ChudoTable >
  )
}