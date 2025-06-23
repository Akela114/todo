interface FetchEmptyProps {
  children: string;
}

export const FetchEmpty = ({ children }: FetchEmptyProps) => {
  return (
    <div className="flex items-center justify-center font-medium bg-base-100 p-8 rounded-lg">
      {children}
    </div>
  );
};
