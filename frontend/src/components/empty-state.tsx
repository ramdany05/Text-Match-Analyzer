import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyHistoryIllustration } from "@/components/illustrations/empty-history";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border rounded-lg bg-card/50 space-y-3">
      {icon ? (
        <div className="p-3 bg-muted rounded-full text-muted-foreground mb-1">
          {icon}
        </div>
      ) : (
        <EmptyHistoryIllustration />
      )}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="h-8 text-xs font-mono mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
