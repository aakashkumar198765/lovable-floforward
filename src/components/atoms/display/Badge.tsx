import React from "react";
import { BadgeProps } from "../../../types";
import { cn } from "../../../utils/utils";
import { badgeColorClasses } from "../../../utils/tailwindClassMaps";
import { Button } from "../form";

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  color = "primary",
  removable = false,
  onRemove,
  className = "",
  style = {},
}) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && typeof onRemove === "function") {
      onRemove();
    }
  };

  const badgeClasses = cn(
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200",
    "font-work-sans",
    badgeColorClasses.colorClasses[
      color as keyof typeof badgeColorClasses.colorClasses
    ]?.[variant as keyof typeof badgeColorClasses.variantClasses] ||
      badgeColorClasses.variantClasses[
        variant as keyof typeof badgeColorClasses.variantClasses
      ],
    removable && "pr-1",
    className
  );

  return (
    <span className={badgeClasses} style={style}>
      {children}
      {removable && (
        <Button
          type="button"
          onClick={handleRemove}
          variant="ghost"
          size="xs"
          aria-label="Remove"
          className="ml-1 w-4 h-4 rounded-full text-xs text-white hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
        >
          ×
        </Button>
      )}
    </span>
  );
};

export default Badge;
