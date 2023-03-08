import React, { HTMLAttributes, ReactNode, useCallback } from "react";
import clsx from 'classnames';
import {
  wrapperClassName,
  tableClassName,
  tableHeaderClassName,
  tableHeaderRowClassName,
  tableHeaderColumnClassName,
  tableBodyClassName,
  tableBodyRowClassName,
  tableBodyCellClassName
} from 'config'
import { ChudoTableColumnType } from "types";

/**
 * Wrapper
 */
export interface TableWrapperPropsInterface extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const TableWrapper = (props: TableWrapperPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <div
      tabIndex={0}
      className={clsx(wrapperClassName)}
      role="group"
      {...getProps()}
    >
      {children}
    </div>
  )
}

/**
 * Root
 */
export interface TableRootPropsInterface extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const TableRoot = (props: TableRootPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <table
      role="table"
      className={clsx(tableClassName)}
      {...getProps()}
    >
      {children}
    </table>
  )
}


/**
 * Header
 */
export interface TableHeaderPropsInterface extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHeader = (props: TableHeaderPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <thead role="rowgroup" className={clsx(tableHeaderClassName)} {...getProps()}>
      {children}
    </thead>
  )
}

/**
 * Header Row
 */
export interface TableHeaderRowPropsInterface extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export const TableHeaderRow = (props: TableHeaderRowPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tr role="row" className={clsx(tableHeaderRowClassName)} {...getProps()}>
      {children}
    </tr>
  )
}

/**
 * Header Column
 */
export interface TableColumnPropsInterface extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  type: ChudoTableColumnType;
}

export const TableColumn = (props: TableColumnPropsInterface) => {
  const { className, children, type, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <th role="columnheader" className={clsx(tableHeaderColumnClassName)} data-type={type} {...getProps()}>
      {children}
    </th>
  )
}

/**
 * Body
 */

export interface TableBodyPropsInterface extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableBody = (props: TableBodyPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tbody role="rowgroup" className={clsx(tableBodyClassName)} {...getProps()}>
      {children}
    </tbody>
  )
}

/**
 * Row
 */

export interface TableRowPropsInterface extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export const TableRow = (props: TableRowPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tr role="row" className={clsx(tableBodyRowClassName)} {...getProps()}>
      {children}
    </tr>
  )
}

/**
 * Cell
 */

export interface TableCellPropsInterface extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export const TableCell = (props: TableCellPropsInterface) => {
  const { children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <td role="cell" className={tableBodyCellClassName} {...getProps()}>
      {children}
    </td>
  )
}