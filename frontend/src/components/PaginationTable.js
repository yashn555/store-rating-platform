import React from 'react';
import { TablePagination, Box } from '@mui/material';

const PaginationTable = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows per page:"
        sx={{
          '& .MuiTablePagination-select': {
            borderRadius: 1,
          },
        }}
      />
    </Box>
  );
};

export default PaginationTable;