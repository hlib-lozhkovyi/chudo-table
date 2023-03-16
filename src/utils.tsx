import React, { ReactElement, ReactNode, Children } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import {
  Column, SelectColumn, ActionColumn, CheckboxInput, IndeterminateCheckboxInput, ColumnProps, TableColumnActionWrapper,
  TableColumnSimpleWrapper
} from 'components';
import { AccessorKey, ChudoTableColumn, ChudoTableColumnAlignment, ChudoTableColumnSortDirection, ChudoTableColumnType, ChudoTableRow } from 'types';
import { CellWrapper, ColumnHeader, } from 'elements';

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
export function getColumnDefaultAlignment(type: ChudoTableColumnType | null): ChudoTableColumnAlignment {
  switch (type) {
    case 'action':
      return 'right';

    default:
      return 'left';
  }
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
    const { accessor, Wrapper, width, alignment, sortable } = element.props
    let { children, Header, HeaderWrapper, minWidth = 'min-content', maxWidth = 'max-content', resizable } = element.props;
    let computedWidth = width;

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

      if (!HeaderWrapper) {
        HeaderWrapper = TableColumnSimpleWrapper;
      }

      computedWidth = `var(--ct-checkbox-size)`;
    }

    if (type === 'action') {
      maxWidth = '1fr';
    }

    if (!resizable) {
      resizable = getColumnResiableValueFromTheProps(element.props)
    }

    if (sortable) {
      if (!HeaderWrapper) {
        HeaderWrapper = TableColumnActionWrapper;
      }
    }

    const route: ChudoTableColumn<Record> = {
      type,
      accessor,
      sortable,
      resizable,
      width,
      minWidth,
      maxWidth,
      computedWidth,
      alignment: alignment ?? getColumnDefaultAlignment(type),
      Header: Header
        ? () => Header
        : () => <ColumnHeader name={accessor} sortable={sortable} />,
      HeaderWrapper: HeaderWrapper ?? TableColumnSimpleWrapper,
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
export function getRowIndex(page: number, index: number) {
  return page * index;
}

/**
 * 
 */
export function getCellValue<Record, Key extends AccessorKey<Record> = AccessorKey<Record>>(row: ChudoTableRow<Record>, accessor: Key): Record[Key] {
  return get(row, ['_raw', accessor]);
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
export function widthToStyleValue(width: number | string): string {
  if (!isNumber(width)) {
    return width;
  }

  return `${width}px`;
}

/**
 * 
 */
export function getNextColumnSortValue(sort: ChudoTableColumnSortDirection | undefined): ChudoTableColumnSortDirection | undefined {
  if (sort === undefined) {
    return 'ascending';
  }

  if (sort === 'ascending') {
    return 'desceding'
  }

  return undefined;
}