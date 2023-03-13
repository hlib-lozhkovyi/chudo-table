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
  DataFetcherPropsInterface,
  TableHeader
} from 'index';
import { SelectedPanel } from 'components';

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
  const fetcher = ({ page }: DataFetcherPropsInterface): Promise<UserResponse> => {
    return fetch(`https://reqres.in/api/users?page=${page}`)
      .then(response => response.json())
  }

  return (
    <ChudoTable
      id="users"
      idAccessor="id"
      rounded
      border
      stripe
      rowBorder
      compact
      highlightRow
      highlightColumn
    >
      <TableHeader caption="Users" />
      <Table>
        <Columns>
          <SelectColumn accessor="id" />
          <Column<User>
            accessor="avatar"
            Header="Profile"
            width={300}
            minWidth={40}
          >
            {({ avatar, first_name, email }) =>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src={avatar}
                  alt={first_name}
                  width={32}
                  height={32}
                  style={{
                    borderRadius: '50%'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                  <span>{first_name}</span>
                  <span style={{ color: '#434343' }}>{email}</span>
                </div>
              </span>
            }
          </Column>
          <Column accessor="last_name" Header="Last Name" minWidth={110} />
          <ActionColumn<User>>
            {({ id }) =>
              <>
                <button className="btn" onClick={() => alert(`delete ${id}`)}>Delete</button>
                <button className="btn" onClick={() => alert(`edit ${id}`)}>Edit</button>
              </>
            }
          </ActionColumn>
        </Columns>
      </Table>
      <Pagination<User, UserResponse>
        pageSize={6}
      />
      <DataSource<User, UserResponse>
        fetcher={fetcher}
        parse={(response) => ({
          data: response.data,
          totalPages: response.total_pages,
          totalCount: response.total
        })}
      />
    </ChudoTable>
  )
}