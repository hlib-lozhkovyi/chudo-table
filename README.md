# 🪄 ChudoTable

🧩 Declarative and extensible react Table library

This is POC project. I'll be happy to hear any feedback or your experience. Thanks! ✨

Full TypeScript support. Why not? 

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

### Custom Cell rendering

What if I want to have custom renderer? Like show the avatar. Here is an example:

```jsx
<ChudoTable>
  <Table>
    <Columns>
      <Column accessor="id" />
      <Column accessor="avatar">
        {({ avatar, fulName }) => (
          <img
            src={avatar}
            alt={fulName}
            width={32}
            height={32}
            style={{
              borderRadius: '50%',
            }}
          />
        )}
      </Column>
      <Column accessor="email" />
      <Column accessor="fulName" />
    </Columns>
  </Table>
  <DataSource fetcher={fetcher} />
</ChudoTable>
```

### Custom Table Header caption?

Yes, still supported.

```jsx
<ChudoTable>
  <Table>
    <Columns>
      <Column accessor="id" Header={null} />
      <Column accessor="email" Header="Email" />
      <Column accessor="firstName" Header="Name" />
    </Columns>
  </Table>
  <DataSource fetcher={fetcher} />
</ChudoTable>
```

### Response formatting

It looks nice? Still, my response looking something different, than just an array.
No worries! You wanna transform the data? Here is `<DataTransformer />`

```jsx
<ChudoTable>
  <Table>
    <Columns>
      <Column accessor="id" />
      <Column accessor="email" />
      <Column accessor="firstName" />
    </Columns>
  </Table>
  <DataSource fetcher={fetcher} />
  <DataTransformer
    getRaws={(response) => response.data}
    // or even simplier
    // getRaws="data"
  />
</ChudoTable>
```

### Pagination

Nice. But what about pagination? No worries, here is a `<Pagination />` component.

```jsx
<ChudoTable>
  <Table>
    <Columns>
      <Column accessor="id" />
      <Column accessor="email" />
      <Column accessor="firstName" />
    </Columns>
  </Table>
  <DataSource fetcher={fetcher} />
  <Pagination
    pageSize={10}
    getTotalCount={(response) => response.total}
    getTotalPages={(response) => response.total_pages}
  />
  <DataTransformer getData={(response) => response.data} />
</ChudoTable>
```

## Status

The libary is in the progress (this is pet project!). Here is a feature list in backlog.

#### Alpha

- [x] Basic
- [x] Declarative Column
- [ ] Custom Cell Rendering
- [ ] Custom Row Rendering
- [ ] Action Column
- [ ] Fixed Column
- [ ] Selection
- [x] Pagination
- [x] Basic sorting
- [ ] Searching
- [ ] Layouts and styling

#### Pre-beta

- [ ] Responsive
- [ ] Row Editing
- [ ] Column Filtering
- [ ] Lazy loading
- [ ] Expanding
- [ ] Column Resize
- [ ] Examples

### Version 1

- [ ] Virtualization
- [ ] Column Group
- [ ] Data Formatting
- [ ] 🐛 Bugifxes :)

### Version 2

- [ ] Antd Adapter
- [ ] Material UI Adapter
- [ ] 🐛 Bugifxes :)
