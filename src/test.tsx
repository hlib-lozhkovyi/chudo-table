import React from 'react';
import { useChudoTable } from "hooks/use-chudo-table.hook";

interface User {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const Test = () => {
  const {
    ChudoTable,
    DataSource,
    Table,
    Columns,
    Column,
  } = useChudoTable<User>();

  const fetcher = (): Promise<User[]> => {
    return fetch('https://reqres.in/api/users?page=1')
      .then(response => response.json())
      .then(response => response.data)
      .catch(error => console.error(error));
  }

  const DEMO_DATA: User[] = [
    {
      "id": '7',
      "email": "michael.lawson@reqres.in",
      "first_name": "Michael",
      "last_name": "Lawson",
      "avatar": "https://reqres.in/img/faces/7-image.jpg"
    },
    {
      "id": '8',
      "email": "lindsay.ferguson@reqres.in",
      "first_name": "Lindsay",
      "last_name": "Ferguson",
      "avatar": "https://reqres.in/img/faces/8-image.jpg"
    },
    {
      "id": '9',
      "email": "tobias.funke@reqres.in",
      "first_name": "Tobias",
      "last_name": "Funke",
      "avatar": "https://reqres.in/img/faces/9-image.jpg"
    },
    {
      "id": '10',
      "email": "byron.fields@reqres.in",
      "first_name": "Byron",
      "last_name": "Fields",
      "avatar": "https://reqres.in/img/faces/10-image.jpg"
    },
    {
      "id": '11',
      "email": "george.edwards@reqres.in",
      "first_name": "George",
      "last_name": "Edwards",
      "avatar": "https://reqres.in/img/faces/11-image.jpg"
    },
    {
      "id": '12',
      "email": "rachel.howell@reqres.in",
      "first_name": "Rachel",
      "last_name": "Howell",
      "avatar": "https://reqres.in/img/faces/12-image.jpg"
    }
  ]

  return (
    <ChudoTable>
      <DataSource fetcher={fetcher} />
      <Table>
        <Columns>
          <Column accessor="id" Header="id" />
          <Column accessor="avatar" Header={"avatar"}>
            {({ avatar }) => <img src={avatar} style={{ width: 22, height: 22, borderRadius: '50%' }} />}
          </Column>
          <Column accessor="email" Header="email" />
        </Columns>
      </Table>
    </ChudoTable>
  )
}