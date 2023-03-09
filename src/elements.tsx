import React, { HTMLAttributes, ReactNode, useCallback, useMemo } from "react";
import clsx from 'classnames';
import {
  containerClassName,
  wrapperClassName,
  tableClassName,
  tableHeadClassName,
  tableHeadRowClassName,
  tableHeadColumnClassName,
  tableBodyClassName,
  tableBodyRowClassName,
  tableBodyCellClassName,
  tableBodyCellWrapperClassName,
  tableCellClassName,
  tableRowClassName,
} from 'config'
import { ChudoTableColumnType } from "types";

/**
 * Wrapper
 */
export interface TableContainerPropsInterface extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  border?: boolean;
  rounded?: boolean;
}

export const TableContainer = (props: TableContainerPropsInterface) => {
  const {
    className,
    children,
    border,
    rounded,
    ...rest
  } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <figure {...getProps()} className={clsx(containerClassName, {
      [containerClassName + '--border']: border,
      [containerClassName + '--rounded']: rounded,
    })}>
      {children}
    </figure>
  )
}
/**
 * Wrapper
 */
export interface TableWrapperPropsInterface extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tableId?: string;
}

export const TableWrapper = (props: TableWrapperPropsInterface) => {
  const { className, children, tableId, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  const tableCaption = useMemo(() => tableId ? `${tableId}-caption` : undefined, [tableId])

  return (
    <div
      tabIndex={0}
      className={clsx(wrapperClassName)}
      role="group"
      {...(tableCaption && ({
        'aria-labelledby': tableCaption
      }))}
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
 * Head
 */
export interface TableHeadPropsInterface extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHead = (props: TableHeadPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <thead role="rowgroup" className={clsx(tableHeadClassName)} {...getProps()}>
      {children}
    </thead>
  )
}

/**
 * Head Row
 */
export interface TableHeadRowPropsInterface extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export const TableHeadRow = (props: TableHeadRowPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tr role="row" className={clsx(tableRowClassName, tableHeadRowClassName)} {...getProps()}>
      {children}
    </tr>
  )
}

/**
 * Head Column
 */
export interface TableColumnPropsInterface extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  type: ChudoTableColumnType;
}

export const TableColumn = (props: TableColumnPropsInterface) => {
  const { className, children, type, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <th role="columnheader" className={clsx(tableCellClassName, tableHeadColumnClassName)} data-type={type} {...getProps()}>
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
    <tr role="row" className={clsx(tableRowClassName, tableBodyRowClassName)} {...getProps()}>
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
    <td role="cell" className={clsx(tableCellClassName, tableBodyCellClassName)} {...getProps()}>
      {children}
    </td>
  )
}

/**
 * ColumnHeader
 */
export interface ColumnHeaderProps {
  name: ReactNode;
}

export function ColumnHeader(props: ColumnHeaderProps) {
  const { name } = props;

  return <>{name}</>
  return <>{name}<SortArrow sortDir={"ascending"} /></>
}

/**
 * ColumnHeader
 */
export interface ColumnWrapperProps {
  children: ReactNode;
}

export function ColumnWrapper(props: ColumnWrapperProps) {
  const { children } = props;

  return <div>{children}</div>
}

/**
 * CellWrapper
 */
export interface CellWrapperProps {
  children: ReactNode;
}

export function CellWrapper(props: CellWrapperProps) {
  const { children } = props;

  return <div className={tableBodyCellWrapperClassName}>{children}</div>
}


/***
 * SortArrow
 */

export interface SortArrowProps {
  sortDir: 'ascending' | 'desceding';
  isCurrent?: boolean;
}

export function SortArrow(props: SortArrowProps) {
  const { sortDir, isCurrent } = props;
  const ascending = sortDir === 'ascending';

  return (
    <svg viewBox="0 0 100 200" width="100" height="200">
      {!(!ascending && isCurrent) &&
        <polyline points="20 50, 50 20, 80 50"></polyline>
      }
      <line x1="50" y1="20" x2="50" y2="180"></line>
      {!(ascending && isCurrent) &&
        <polyline points="20 150, 50 180, 80 150"></polyline>
      }
    </svg>
  );
}