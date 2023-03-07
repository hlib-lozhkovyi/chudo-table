import React from 'react';
import { ChudoTableColumnInterface, Item } from 'chudo-table';


const renderDefaultHeader = (accessor: ChudoTableColumnInterface<T>['accessor']) => () => accessor

export const createColumnsFromChildren = <T extends Item,>(children: React.ReactNode): ChudoTableColumnInterface<T>[] => {
  let columns: ChudoTableColumnInterface<T>[] = [];

  React.Children.forEach(children, (element, index) => {
    if (!React.isValidElement(element)) {
      return;
    }

    const { accessor, Header, children } = element.props;

    let route: ChudoTableColumnInterface<T> = {
      accessor,
      renderHeader: Header ? () => Header : renderDefaultHeader(accessor),
      renderCell: children ? (_value, row) => children(row) : (value) => value,
    };

    columns.push(route);
  });

  return columns;
};
