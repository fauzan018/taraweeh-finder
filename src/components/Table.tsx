"use client";
import React from "react";
import { Card } from "./ui/Card";

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  loading,
  emptyMessage = "No data available",
}: TableProps<T>) {
  if (loading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-surface rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card variant="glass" padding="xl" className="text-center">
        <p className="text-text-secondary">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className="px-6 py-4 text-left text-sm font-semibold text-text-primary"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-sm text-text-primary"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
