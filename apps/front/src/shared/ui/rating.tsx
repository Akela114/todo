import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

interface RatingProps {
  total: number;
  selected: number;
}

export const Rating = ({ total, selected }: RatingProps) => {
  return (
    <div className="flex items-center flex-nowrap">
      {Array.from({ length: total }).map((_, i) =>
        i > selected - 1 ? (
          <StarIcon key={i} className="size-3" />
        ) : (
          <StarFilledIcon key={i} className="size-3 text-accent" />
        ),
      )}
    </div>
  );
};
