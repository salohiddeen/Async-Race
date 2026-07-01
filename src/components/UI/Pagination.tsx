import React from 'react';
import './Pagination.css';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  limit,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ◀ Prev
      </button>
      <span className="pagination__info">
        Page
        {' '}
        {page}
        {' '}
        /
        {' '}
        {totalPages}
      </span>
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next ▶
      </button>
    </div>
  );
};

export default Pagination;
