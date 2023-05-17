"use client";

import style from "./Paginated.module.css";
import { useEffect, useState } from "react";

export default function Paginated({ url, currentPage, setCurrentPage }) {
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPaginatedData(data.users);
        setTotalPages(data.pageInfo.totalPages);
        console.log(data.pageInfo.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [url, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div>
      {/* Agrega botones de navegación para el paginado */}
      <div className={style.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`${style.arrowButton} ${style.leftArrow}`}
        >
          &lt;
        </button>

        {/* Cuadritos de paginación */}
        {Array.from({ length: totalPages }).map(
          (_, index) => (
            console.log(totalPages),
            (
              <button
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                disabled={currentPage === index + 1}
                className={`${style.pageNumber} ${
                  currentPage === index + 1 ? style.active : ""
                }`}
              >
                {index + 1}
              </button>
            )
          )
        )}

        <button
          onClick={handleNextPage}
          disabled={currentPage === 10}
          className={`${style.arrowButton} ${style.rightArrow}`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
