# 🪄 ChudoTable

Declarative React Table library.

### Motivation

React is component-based framework. We store the application UI state in components.
Applications we develop looks like set of Containers and Components in some hierarchy.
However, when it comes to the tables, we're breaking all "rules" and finnaly our table looks like.

```
...
    const data = [...]
    const columns = [...]

    <Table data={data} columns={columns} />
```

## Why not to use declarative approach, which looks familiar to everyone?

### Getting started

The basic example show basic table users:

```
const fetcher = () => {
    return fetch(`https://your.awesome-site.com/api/users`)
      .then(response => response.json())
}

<ChudoTable>
    <Table>
        <Columns>
            <Column accessor="id" />
            <Column accessor="email" />
            <Column accessor="firstName" />
        </Columns>
    </Table>
    <DataSource fetcher={fetcher} />
</ChudoTable>
```

You see? No local state, long configuration object. As simple as it is.
