import React, { ReactElement, ReactNode, Children } from 'react';
import isFunction from 'lodash/isFunction'
import { Column, SelectColumn, ActionColumn, CheckboxInput, IndeterminateCheckboxInput, ColumnProps } from 'components';
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

export function getColumnResiableValueFromTheProps(props: ColumnProps) {
  const { minWidth, maxWidth } = props;

  if (!!minWidth || !!maxWidth) {
    return true;
  }

  return false
}

/**
 * 
 */
export function getColumnDefaultResizableValue(type: ChudoTableColumnType | null) {
  switch (type) {
    case 'select':
    case 'action':
      return false;

    default:
      return false;
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
    const { accessor, Wrapper, width, minWidth, maxWidth } = element.props
    let { children, Header, resizable } = element.props;

    const type = getColumnType(element);

    if (!type) {
      return;
    }

    if (type === 'select') {
      if (!children) {
        children = CheckboxInput;
      }

      if (!Header) {
        Header = <IndeterminateCheckboxInput />;
      }
    }

    if (!resizable) {
      resizable = getColumnResiableValueFromTheProps(element.props)
    }

    const route: ChudoTableColumn<Record> = {
      accessor,
      type,
      resizable,
      width,
      minWidth,
      maxWidth,
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

/**
 * 
 */
export function generateRowId(tableId: string | undefined, page: number, index: number) {
  return `${tableId}-row-${page}.${index}`;
}

/**
 * 
 */

export function isAllRowsSelected(rowsCount: number, pageSize: number) {
  return rowsCount === pageSize
}

/**
 * 
 */
export function widthToStyleValue(width: number): string {
  return `${width}px`
}