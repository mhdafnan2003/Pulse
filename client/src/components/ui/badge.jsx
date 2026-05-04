import * as React from "react";

import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const styles =
    variant === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : variant === "destructive"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-slate-200 bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        styles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
