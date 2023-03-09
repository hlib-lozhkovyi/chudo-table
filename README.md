# 🪄 ChudoTable

Declarative React Table library.

<hr />

This is POC project. I'll be happy to listen any feedback or your experience. Thanks! ✨

### Motivation

React is component-based framework. We store the application UI state in components.
Applications we develop looks like set of Containers and Components in some hierarchy.
However, when it comes to the tables, we're breaking all "rules" and finnaly our table looks like.

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

The basic example show basic table users:

```jsx
  const fetcher = () => {
    return fetch(`https://your.awesome-site.com/api/users`).then((response) => response.json());
  };
  ...
  <ChudoTable>
    <Table>
      <Columns>
        <Column accessor="id" />
        <Column accessor="email" />
        <Column accessor="firstName" />
      </Columns>
    </Table>
    <DataSource fetcher={fetcher} />
  </ChudoTable>;
```

You see? No local state, long configuration object. As simple as it is.
