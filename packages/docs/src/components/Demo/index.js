import React from 'react';
import {
  ChudoTable,
  DataFetcherProps,
  TableHeader,
  Table,
  Columns,
  Column,
  SelectColumn,
  ActionColumn,
  Pagination,
  DataSource,
  ReactFromModule
} from 'chudo-table';
import 'chudo-table/dist/index.css'

import styles from './demo.module.css';


export default function DemoTableNew() {
  const fetcher = ({ limit, offset }) => {
    return fetch(`https://dummyjson.com/users?limit=${limit}&skip=${offset}`).then((response) => response.json());
  };


  return (
    <section id="demo" className={styles.demo}>
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
            <Column accessor="image" Header="Profile" sortable={false} resizable>
              {({ image, firstName, email }) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src={image}
                    alt={firstName}
                    width={32}
                    height={32}
                    style={{
                      borderRadius: '50%',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                    <span>{firstName}</span>
                    <span style={{ color: '#434343' }}>{email}</span>
                  </div>
                </span>
              )}
            </Column>
            <Column accessor="email" Header="Email" resizable sortable />
            <Column accessor="phone" Header="Phone" resizable sortable />
            <ActionColumn Header={'Actions'}>
              {({ id }) => (
                <>
                  <button className="btn" onClick={() => alert(`delete ${id}`)}>
                    Delete
                  </button>
                  <button className="btn" onClick={() => alert(`edit ${id}`)}>
                    Edit
                  </button>
                </>
              )}
            </ActionColumn>
          </Columns>
        </Table>
        <Pagination pageSize={10} />
        <DataSource
          fetcher={fetcher}
          parse={(response) => ({
            data: response.users,
            totalPages: Math.ceil(response.total / response.limit),
            totalCount: response.total,
          })}
        />
      </ChudoTable>
    </section>
  );
};
