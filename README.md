# 🪄 ChudoTable

<p align="center">
  <img width="824" height="557" alt="Screenshot 2023-03-13 at 12 34 56" src="https://user-images.githubusercontent.com/20016615/224678419-95919460-073e-4250-9df6-4222e63e81f4.png" />
</p>

<h3 align="center">
  🧩 Declarative React Table library
</h3>

<br>

This is POC project. I'll be happy to hear any feedback or your experience. Thanks! ✨

### Motivation

React is component-based framework. We store the application UI state in components.
Applications we develop looks like set of Containers and Components in some hierarchy.
However, when it comes to the tables, we're breaking all "rules" and in the end our table looks like.

```jsx
const { fetch, data, status, error, ... } = useData();
const columns = [...]

useEffect(() => {
  fetch()
}, []);

...
<Table data={data} columns={columns} />
```

## Why not to use declarative approach, which looks familiar to everyone?

### Getting started

The basic example show user table with Id, Email and Full Name columns:

```jsx
const fetcher = () => {
  return fetch(`https://your.awesome-site.com/api/users`)
    .then((response) => response.json());
};
...
<ChudoTable>
  <Table>
    <Columns>
      <Column accessor="id" />
      <Column accessor="email" />
      <Column accessor="fulName" />
    </Columns>
  </Table>
  <DataSource fetcher={fetcher} />
</ChudoTable>;
```

You see? No local state, long configuration object. As simple as it is.

### Advanced Example

Nice. But what about pagination? No worries, here is a `<Pagination />` component.

```jsx
<ChudoTable id="users" idAccessor="id" rounded border stripe rowBorder compact highlightRow>
  <TableHeader caption="Users" />
  <Table>
    <Columns>
      <SelectColumn accessor="id" />
      <Column accessor="avatar" Header="Profile">
        {({ avatar, first_name, email }) => (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={avatar}
              alt={first_name}
              width={32}
              height={32}
              style={{
                borderRadius: '50%',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
              <span>{first_name}</span>
              <span style={{ color: '#434343' }}>{email}</span>
            </div>
          </span>
        )}
      </Column>
      <Column accessor="last_name" Header="Last Name" />
      <ActionColumn>
        {({ id }) => (
          <>
            <button className="btn" onClick={() => alert(`details ${id}`)}>
              Details
            </button>
          </>
        )}
      </ActionColumn>
    </Columns>
  </Table>
  <Pagination pageSize={6} />
  <DataSource
    fetcher={fetcher}
    parse={(response) => ({
      data: response.data,
      totalPages: response.total_pages,
      totalCount: response.total,
    })}
  />
</ChudoTable>
```