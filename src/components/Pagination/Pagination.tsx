import css from './Pagination.module.css';
import ReactPaginate from "react-paginate";
import type { FC } from "react";


interface PaginationProps {
  pageCount: number;               
  currentPage: number;             
  onPageChange: (page: number) => void; 
}

const Pagination: FC<PaginationProps> = ({ pageCount, currentPage, onPageChange }) => {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      previousLabel={"←"}
      nextLabel={"→"}
      pageCount={pageCount}
      forcePage={currentPage - 1} // ReactPaginate нумерує з 0
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      onPageChange={(data) => onPageChange(data.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.page}
      nextClassName={css.page}
    />
  );
};

export default Pagination;