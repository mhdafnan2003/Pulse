import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm !text-slate-900 placeholder:!text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
