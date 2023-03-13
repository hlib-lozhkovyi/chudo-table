import React, { ChangeEvent, HTMLAttributes, InputHTMLAttributes, ReactNode, useCallback, useMemo, useState } from "react";
import clsx from 'classnames';
import {
  containerClassName,
  wrapperClassName,
  wrapperStripeClassName,
  wrapperRowBorderClassName,
  wrapperCompactClassName,
  wrapperHighlightRowClassName,
  wrapperHighlightColumnClassName,
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
  containerBorderClassName,
  containerRoundedClassName,
  wrapperBorderClassName,
  tableHeadColumnResizerClassName,
  columnResizerClassName,
  columnResizerFullClassName,
  columnResizerLineClassName,
} from 'config'
import { ChudoTableColumnType, RecordID, TableStyleContextType } from "types";
import { useIndeterminateCheckbox, useTableLayoutContext } from "hooks";
import { widthToStyleValue } from "utils";

/**
 * Wrapper
 */
export interface TableContainerProps extends HTMLAttributes<HTMLDivElement>, Pick<TableStyleContextType, 'border' | 'rounded'> {
  children: ReactNode;
}

export const TableContainer = (props: TableContainerProps) => {
  const {
    className,
    children,
    border,
    rounded,
    ...rest
  } = props;

  const getProps = useCallback(() => rest, [rest])

  const {
    border: tableBorder
  } = useTableLayoutContext();

  const layoutStyles = {
    border: border ?? tableBorder,
  }

  return (
    <figure
      {...getProps()}
      className={clsx(containerClassName, {
        [containerBorderClassName]: layoutStyles.border,
        [containerRoundedClassName]: rounded,
      })}
    >
      {children}
    </figure>
  )
}
/**
 * Wrapper
 */
export interface TableWrapperProps extends HTMLAttributes<HTMLDivElement>, Omit<TableStyleContextType, 'rounded'> {
  children: ReactNode;
  tableId?: string;
}

export const TableWrapper = (props: TableWrapperProps) => {
  const {
    className,
    children,
    tableId,
    border,
    stripe,
    rowBorder,
    compact,
    highlightRow,
    highlightColumn,
    ...rest
  } = props;

  const {
    border: tableBorder,
    stripe: tableStripe,
    rowBorder: tableRowBorder,
    compact: tableCompact,
    highlightRow: tableHighlightRow,
    highlightColumn: tableHighlightColumn
  } = useTableLayoutContext();

  const layoutStyles = {
    border: border ?? tableBorder,
    stripe: stripe ?? tableStripe,
    rowBorder: rowBorder ?? tableRowBorder,
    compact: compact ?? tableCompact,
    highlightRow: highlightRow ?? tableHighlightRow,
    highlightColumn: highlightColumn ?? tableHighlightColumn,
  }

  const getProps = useCallback(() => rest, [rest]);

  const tableCaption = useMemo(() => tableId ? `${tableId}-caption` : undefined, [tableId]);

  return (
    <div
      tabIndex={0}
      className={clsx(wrapperClassName, {
        [wrapperBorderClassName]: layoutStyles.border,
        [wrapperStripeClassName]: layoutStyles.stripe,
        [wrapperRowBorderClassName]: layoutStyles.rowBorder,
        [wrapperCompactClassName]: layoutStyles.compact,
        [wrapperHighlightRowClassName]: layoutStyles.highlightRow,
        [wrapperHighlightColumnClassName]: layoutStyles.highlightColumn,
      })}
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
export interface TableRootProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const TableRoot = (props: TableRootProps) => {
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
export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHead = (props: TableHeadProps) => {
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
export interface TableHeadRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export const TableHeadRow = (props: TableHeadRowProps) => {
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
export interface TableColumnProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  width: number;
  type: ChudoTableColumnType;
}

export const TableColumn = (props: TableColumnProps) => {
  const { className, children, width, type, ...rest } = props;

  const getProps = useCallback(() => rest, [rest]);

  return (
    <th role="columnheader" className={clsx(tableCellClassName, tableHeadColumnClassName)} data-type={type} style={{
      width: widthToStyleValue(width)
    }} {...getProps()}>
      {children}
    </th>
  )
}

/**
 * Body
 */

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableBody = (props: TableBodyProps) => {
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

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  rowId: string;
  index: number;
}

export const TableRow = (props: TableRowProps) => {
  const {
    className,
    children,
    rowId,
    index,
    ...rest
  } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tr
      role="row"
      className={clsx(tableRowClassName, tableBodyRowClassName)}
      data-row-id={rowId}
      data-index={index}
      {...getProps()}
    >
      {children}
    </tr>
  )
}

/**
 * Cell
 */

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  rowId: RecordID;
  type: ChudoTableColumnType;
}

export const TableCell = (props: TableCellProps) => {
  const { children, type, rowId, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <td
      role="cell"
      data-type={type}
      data-row-id={rowId}
      className={clsx(tableCellClassName, tableBodyCellClassName)}
      {...getProps()}
    >
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
 * Checkbox
 */
export interface IndeterminateCheckbox extends InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

export function IndeterminateCheckbox(props: IndeterminateCheckbox) {
  const {
    indeterminate,
    checked,
    ...rest
  } = props;

  const isFullyChecked = useMemo(() => checked && !indeterminate, [indeterminate, checked]);

  return (
    <label className="chudo__checkbox">
      <input
        checked={checked}
        aria-checked={checked}
        className="chudo__checkbox__input"
        data-indeterminate={indeterminate}
        type="checkbox"
        {...rest}
      />
      <svg viewBox="0 0 24 24" role="presentation" className="chudo__checkbox__icon">
        <g fill-rule="evenodd">
          <rect fill="currentColor" x="6" y="6" width="12" height="12" rx="2" />
          {isFullyChecked && <path d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z" fill="inherit" />}
          {indeterminate && < rect fill="inherit" x="8" y="11" width="8" height="2" rx="1"></rect>}
        </g>
      </svg>
    </label >
  )
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

/**
 * Resizer
 */

export interface TableColumnResizerProps {
  full?: boolean;
}

export function TableColumnResizer(props: TableColumnResizerProps) {
  const { full } = props

  return (
    <div className={clsx(columnResizerClassName, full && columnResizerFullClassName)} >
      <span className={columnResizerLineClassName} />
    </div>
  )
}