import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "../../lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("rounded-md border border-slate-200 bg-white", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between px-3 py-2 text-sm font-semibold text-slate-800 transition-all hover:text-slate-900",
        "[&[data-state=open]>.accordion-icon]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <i className="fa-solid fa-chevron-down accordion-icon ml-2 text-xs transition-transform" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn("px-3 pb-3 text-sm text-slate-600", className)}
    {...props}
  />
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
