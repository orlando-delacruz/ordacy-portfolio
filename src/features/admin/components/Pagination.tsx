import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as F from './styles/form.styled'
import * as S from './styles/pagination.styled'

type PaginationProps = {
  page: number
  pageCount: number
  pageSize: number
  pageSizes: readonly number[]
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({
  page,
  pageCount,
  pageSize,
  pageSizes,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <S.Bar aria-label="Pagination">
      <S.Range>
        {first}–{last} of {total}
      </S.Range>

      <S.SizeField>
        <label htmlFor="page-size">Rows per page</label>
        <F.Select
          id="page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </F.Select>
      </S.SizeField>

      <S.Pages>
        <S.PageButton
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
        </S.PageButton>
        <S.PageStatus aria-live="polite">
          Page {page} of {pageCount}
        </S.PageStatus>
        <S.PageButton
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
        </S.PageButton>
      </S.Pages>
    </S.Bar>
  )
}
