interface FetchErrorProps {
  children: string;
  onRetry?: () => void;
}

export const FetchError = ({ children, onRetry }: FetchErrorProps) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center font-medium bg-base-100 p-8 rounded-lg border-2 border-error/20">
      {children}
      <button
        type="button"
        onClick={() => onRetry?.()}
        className="btn btn-sm btn-error btn-outline"
      >
        Попробовать еще раз
      </button>
    </div>
  );
};
