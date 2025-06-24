import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableFooter,
} from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

hubspot.extend(() => <Extension />);

const ORIGINAL_DATA = [
  {
    userId: '1',
    email: 'user1@example.com',
    timestamp: '2024-06-01 10:00:00',
  },
  {
    userId: '2',
    email: 'user2@example.com',
    timestamp: '2024-06-01 11:00:00',
  },
  {
    userId: '3',
    email: 'user3@example.com',
    timestamp: '2024-06-01 12:00:00',
  },
];

const DEFAULT_STATE = {
  userId: 'none',
  email: 'none',
  timestamp: 'none',
};

function Extension() {
  const [data, setData] = useState(ORIGINAL_DATA);
  const [sortState, setSortState] = useState({ ...DEFAULT_STATE });
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const pageCount = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  function handleOnSort(fieldName, sortDirection) {
    const dataClone = [...data];
    dataClone.sort((entry1, entry2) => {
      if (sortDirection === 'ascending') {
        return entry1[fieldName] < entry2[fieldName] ? -1 : 1;
      }
      return entry2[fieldName] < entry1[fieldName] ? -1 : 1;
    });

    setSortState({ ...DEFAULT_STATE, [fieldName]: sortDirection });
    setData(dataClone);
  }

  return (
    <Table
      paginated={true}
      page={page}
      pageCount={pageCount}
      maxVisiblePageButtons={5}
      showButtonLabels={true}
      showFirstLastButtons={true}
      onPageChange={setPage}
    >
      <TableHead>
        <TableRow>
          <TableHeader
            sortDirection={sortState.userId}
            onSortChange={(sortDirection) =>
              handleOnSort('userId', sortDirection)
            }
          >
            User ID
          </TableHeader>
          <TableHeader
            sortDirection={sortState.email}
            onSortChange={(sortDirection) =>
              handleOnSort('email', sortDirection)
            }
          >
            Email
          </TableHeader>
          <TableHeader
            sortDirection={sortState.timestamp}
            onSortChange={(sortDirection) =>
              handleOnSort('timestamp', sortDirection)
            }
          >
            Timestamp
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedData.map(({ userId, email, timestamp }) => {
          return (
            <TableRow key={userId}>
              <TableCell>{userId}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>{timestamp}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}