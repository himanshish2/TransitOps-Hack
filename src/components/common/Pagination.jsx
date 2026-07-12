export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-sm p-3">
      <span className="text-muted-custom" style={{ fontSize: 'var(--font-size-sm)' }}>
        Showing {rangeStart}-{rangeEnd} of {totalItems}
      </span>
      <nav aria-label="Table pagination">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)} aria-label="Previous page">
              Prev
            </button>
          </li>
          {start > 1 && (
            <li className="page-item disabled"><span className="page-link">...</span></li>
          )}
          {pages.map((page) => (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(page)} aria-current={page === currentPage ? 'page' : undefined}>
                {page}
              </button>
            </li>
          ))}
          {end < totalPages && (
            <li className="page-item disabled"><span className="page-link">...</span></li>
          )}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)} aria-label="Next page">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
