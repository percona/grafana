import React, { useEffect } from 'react';
import { useTable, Column } from 'react-table';
import { useStyles } from '@grafana/ui';
import { getStyles } from './AlertRuleTemplatesTable.styles';
import { AlertRuleTemplateService } from '../AlertRuleTemplate.service';

export const AlertRuleTemplatesTable = () => {
  // const getAlertRuleTemplates = async () => {
  //   const { templates } = await AlertRuleTemplateService.list(values);
  // };
  const style = useStyles(getStyles);

  const data = React.useMemo(
    () => [
      {
        name: 'MySQL database down',
        source: 'Percona Enterprise Platform',
        created: '2020-10-01 21:17:00',
      },
      {
        name: 'MongoDB database down',
        source: 'Percona Enterprise Platform',
        created: '2020-10-01 21:17:00',
      },
      {
        name: 'High memory consumption',
        source: 'Built-in',
        created: '2020-10-01 21:17:00',
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      } as Column,
      {
        Header: 'Source',
        accessor: 'source',
      } as Column,
      {
        Header: 'Created',
        accessor: 'created',
      } as Column,
    ],
    []
  );

  useEffect(() => {
    // getAlertRuleTemplates();
  }, []);

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map(column => (
              // Apply the header cell props
              <th {...column.getHeaderProps()}>
                {// Render the header
                column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {// Loop over the table rows
        rows.map(row => {
          // Prepare the row for display
          prepareRow(row);
          return (
            // Apply the row props
            <tr {...row.getRowProps()}>
              {// Loop over the rows cells
              row.cells.map(cell => {
                // Apply the cell props
                return (
                  <td {...cell.getCellProps()}>
                    {// Render the cell contents
                    cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
