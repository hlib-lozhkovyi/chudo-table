import React, { ReactElement, ReactNode, Children } from 'react';
import isFunction from 'lodash/isFunction'
import { Column, SelectColumn, ActionColumn } from 'components';
import { ChudoTableColumn, ChudoTableColumnType } from 'types';
import { CellWrapper, ColumnHeader } from 'elements';

/**
 *
 */
export function getColumnType(node: ReactElement): ChudoTableColumnType | null {
  switch (node.type) {
    case Column:
      return 'common';

    case SelectColumn:
      return 'select';

    case ActionColumn:
      return 'action';

    default:
      return null;
  }
}

/**
 *
 */
export function isEmptyReactChildren(node: ReactNode) {
  return Children.count(node) === 0;
}

/**
 *
 */
export function createColumnsFromChildren<Record = any>(children: React.ReactNode): ChudoTableColumn<Record>[] {
  let columns: ChudoTableColumn<Record>[] = [];

  React.Children.forEach(children, (element, index) => {
    if (!React.isValidElement(element)) {
      return;
    }

    // ColumnPropsInterface
    const { accessor, Header, Wrapper, children } = element.props

    const type = getColumnType(element);

    if (!type) {
      return;
    }

    let route: ChudoTableColumn<Record> = {
      accessor,
      type,
      Header: Header
        ? () => Header
        : () => <ColumnHeader name={accessor} />,
      Wrapper: Wrapper ?? CellWrapper,
      Cell: isFunction(children)
        ? (props) => children(props)
        : !isEmptyReactChildren(children)
          ? React.Children.only(children)
          : ({ value }) => value
    };

    columns.push(route);
  });

  return columns;
}