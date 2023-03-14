import React, { ChangeEvent, Children, HTMLAttributes, InputHTMLAttributes, ReactNode, useCallback, useMemo, useState } from "react";
import clsx from 'classnames';
import isNil from 'lodash/isNil';
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
  tableHeadColumnActionWrapperClassName,
  tableHeadColumnSimpleWrapperClassName,
  tableHeadColumnWrapperClassName,
} from 'config'
import { ChudoTableColumnAlignment, ChudoTableColumnSortDirection, ChudoTableColumnType, RecordID, TableStyleContextType } from "types";
import { useIndeterminateCheckbox, useTableCaption, useTableLayoutContext } from "hooks";
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

  const tableCaption = useTableCaption(tableId);

  return (
    <div
      tabIndex={0}
      role="group"
      {...(tableCaption && ({
        'aria-labelledby': tableCaption
      }))}
      className={clsx(wrapperClassName, {
        [wrapperBorderClassName]: layoutStyles.border,
        [wrapperStripeClassName]: layoutStyles.stripe,
        [wrapperRowBorderClassName]: layoutStyles.rowBorder,
        [wrapperCompactClassName]: layoutStyles.compact,
        [wrapperHighlightRowClassName]: layoutStyles.highlightRow,
        [wrapperHighlightColumnClassName]: layoutStyles.highlightColumn,
      })}
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
  rowCount?: number;
}

export const TableRoot = (props: TableRootProps) => {
  const { id, className, children, rowCount, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <table
      aria-rowcount={rowCount}
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
  alignment: ChudoTableColumnAlignment;
  sortable: boolean | undefined;
}

export const TableColumn = (props: TableColumnProps) => {
  const { className, children, width, type, alignment, sortable, ...rest } = props;

  const getProps = useCallback(() => rest, [rest]);

  return (
    <th
      role="columnheader"
      data-type={type}
      data-alignment={alignment}
      data-sortable={sortable}
      aria-sort="ascending"
      className={clsx(tableCellClassName, tableHeadColumnClassName)}
      style={{
        width: widthToStyleValue(width)
      }}
      {...getProps()}
    >
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
  rowId: RecordID;
  rowIndex: number;
}

export const TableRow = (props: TableRowProps) => {
  const {
    className,
    children,
    rowId,
    rowIndex,
    ...rest
  } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tr
      role="row"
      data-row-id={rowId}
      data-index={rowIndex}
      className={clsx(tableRowClassName, tableBodyRowClassName)}
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
  rowIndex: number;
  type: ChudoTableColumnType;
  alignment: ChudoTableColumnAlignment;
}

export const TableCell = (props: TableCellProps) => {
  const { children, rowId, rowIndex, type, alignment, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <td
      role="cell"
      data-row-id={rowId}
      aria-rowindex={rowIndex}
      data-type={type}
      data-alignment={alignment}
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
  sortable?: boolean;
}

export function ColumnHeader(props: ColumnHeaderProps) {
  const { name } = props;

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
  sortDir?: ChudoTableColumnSortDirection;
  isCurrent?: boolean;
}

export function SortArrow(props: SortArrowProps) {
  const { sortDir, isCurrent } = props;
  const ascending = sortDir === 'ascending';

  const showTopArrow = isCurrent && !isNil(ascending) ? ascending : true;
  const showBottomArrow = isCurrent && !isNil(ascending) ? !ascending : true;

  return (
    <svg viewBox="0 0 60 70">
      <polyline points="0 30 30 0 60 30" data-active={showTopArrow}></polyline>
      <polyline points="0 40 30 70 60 40" data-active={showBottomArrow}></polyline>
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