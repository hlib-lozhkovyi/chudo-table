import {
  ChudoTable,
  DataSource,
  DataFetcherProps,
  Table,
  Columns,
  Column,
  SelectColumn,
  ActionColumn,
  Pagination,
  TableHeader
} from '..';

interface User {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface UserResponse {
  total: 100,
  skip: 0,
  limit: 30,
  users: User[];
}

export const RemoteData = () => {
  const fetcher = ({ limit, offset }: DataFetcherProps<User>): Promise<UserResponse> => {
    return fetch(`https://dummyjson.com/users?limit=${limit}&skip=${offset}`)
      .then(response => response.json())
  }

  return (
    <ChudoTable
      id="users"
      idAccessor="id"
      // fixed
      rounded
      border
      stripe
      rowBorder
      highlightRow
      compact
    >
      <TableHeader caption="Users" />
      <Table>
        <Columns>
          <SelectColumn accessor="id" />
          <Column<User>
            accessor="image"
            Header="Profile"
            sortable={false}
            resizable
          >
            {({ image, firstName, email }) =>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src={image}
                  alt={firstName}
                  width={32}
                  height={32}
                  style={{
                    borderRadius: '50%'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                  <span>{firstName}</span>
                  <span style={{ color: '#434343' }}>{email}</span>
                </div>
              </span>
            }
          </Column>
          <Column accessor="email" Header="Email" resizable sortable />
          <Column accessor="phone" Header="Phone" resizable sortable />
          <ActionColumn<User> Header={"Actions"}>
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
        pageSize={10}
      />
      <DataSource<User, UserResponse>
        fetcher={fetcher}
        parse={(response) => ({
          data: response.users,
          totalPages: Math.ceil(response.total / response.limit),
          totalCount: response.total
        })}
      />
    </ChudoTable>
  )
}