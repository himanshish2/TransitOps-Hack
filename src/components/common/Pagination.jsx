//src/components/common/Pagination.jsx//
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  pageSize = 10,
}) {
  const safeCurrentPage =
    Number(currentPage) || 1;

  const safeTotalPages =
    Number(totalPages) || 1;

  const safeTotalItems =
    Number(totalItems) || 0;

  const safePageSize =
    Number(pageSize) || 10;

  const rangeStart =
    safeTotalItems === 0
      ? 0
      : (safeCurrentPage - 1) *
          safePageSize +
        1;

  const rangeEnd = Math.min(
    safeCurrentPage * safePageSize,
    safeTotalItems
  );

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(
    1,
    safeCurrentPage -
      Math.floor(maxVisiblePages / 2)
  );

  let endPage = Math.min(
    safeTotalPages,
    startPage + maxVisiblePages - 1
  );

  if (
    endPage - startPage + 1 <
    maxVisiblePages
  ) {
    startPage = Math.max(
      1,
      endPage - maxVisiblePages + 1
    );
  }

  for (
    let page = startPage;
    page <= endPage;
    page += 1
  ) {
    pages.push(page);
  }

  const changePage = (page) => {
    if (
      page < 1 ||
      page > safeTotalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-sm p-3">
      <span
        className="text-muted-custom"
        style={{
          fontSize: "var(--font-size-sm)",
        }}
      >
        Showing {rangeStart}–{rangeEnd} of{" "}
        {safeTotalItems}
      </span>

      {safeTotalPages > 1 && (
        <nav aria-label="Table pagination">
          <ul className="pagination pagination-sm mb-0">
            <li
              className={`page-item ${
                safeCurrentPage === 1
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() =>
                  changePage(
                    safeCurrentPage - 1
                  )
                }
                disabled={
                  safeCurrentPage === 1
                }
              >
                Prev
              </button>
            </li>

            {startPage > 1 && (
              <li className="page-item disabled">
                <span className="page-link">
                  …
                </span>
              </li>
            )}

            {pages.map((page) => (
              <li
                key={page}
                className={`page-item ${
                  page === safeCurrentPage
                    ? "active"
                    : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    changePage(page)
                  }
                  aria-current={
                    page === safeCurrentPage
                      ? "page"
                      : undefined
                  }
                >
                  {page}
                </button>
              </li>
            ))}

            {endPage < safeTotalPages && (
              <li className="page-item disabled">
                <span className="page-link">
                  …
                </span>
              </li>
            )}

            <li
              className={`page-item ${
                safeCurrentPage ===
                safeTotalPages
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() =>
                  changePage(
                    safeCurrentPage + 1
                  )
                }
                disabled={
                  safeCurrentPage ===
                  safeTotalPages
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}