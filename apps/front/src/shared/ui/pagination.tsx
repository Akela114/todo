import { TextSkeleton } from "./text-skeleton";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  renderPaginationElement: (page: number, className?: string) => ReactNode;
}

const PAGE_LINK_CLASSNAMES = "join-item btn btn-sm btn-soft tabular-nums";

export const Pagination = ({
  page,
  pageSize,
  totalCount,
  renderPaginationElement,
}: PaginationProps) => {
  const firstPage = 1;
  const previousPage = page - 1;
  const nextPage = page + 1;
  const lastPage = Math.ceil(totalCount / pageSize);

  const shouldRenderFirstPage = firstPage < previousPage;
  const shouldRenderPreviousPageButton = previousPage > 0;
  const shouldRenderNextPageButton = nextPage <= lastPage;
  const shouldRenderLastPage = lastPage > nextPage;

  return (
    <div className="join">
      {shouldRenderFirstPage && (
        <>
          {renderPaginationElement(firstPage, PAGE_LINK_CLASSNAMES)}
          {nextPage - firstPage > 1 && (
            <button type="button" className={PAGE_LINK_CLASSNAMES} disabled>
              ...
            </button>
          )}
        </>
      )}
      {shouldRenderPreviousPageButton &&
        renderPaginationElement(previousPage, PAGE_LINK_CLASSNAMES)}
      {renderPaginationElement(
        page,
        twMerge(PAGE_LINK_CLASSNAMES, "bg-neutral"),
      )}
      {shouldRenderNextPageButton &&
        renderPaginationElement(nextPage, PAGE_LINK_CLASSNAMES)}
      {shouldRenderLastPage && (
        <>
          {lastPage - nextPage > 1 && (
            <button type="button" className={PAGE_LINK_CLASSNAMES} disabled>
              ...
            </button>
          )}
          {renderPaginationElement(lastPage, PAGE_LINK_CLASSNAMES)}
        </>
      )}
    </div>
  );
};

export const PaginationSkeleton = () => {
  return (
    <div className="join">
      <div className="join-item btn btn-sm btn-square cursor-auto">
        <TextSkeleton size="xs" variant="square" />
      </div>
      <div className="join-item btn btn-sm btn-square bg-neutral cursor-auto">
        <TextSkeleton size="xs" variant="square" />
      </div>
      <div className="join-item btn btn-sm btn-square cursor-auto">
        <TextSkeleton size="xs" variant="square" />
      </div>
    </div>
  );
};
