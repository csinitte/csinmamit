import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "~/lib/utils";

// Root component (directly use Tabs from TabsPrimitive)
const Tabs = TabsPrimitive.Root;

// Shared styles
const baseTriggerClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all";
const activeTriggerClasses =
  "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm";
const focusRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const disabledClasses = "disabled:pointer-events-none disabled:opacity-50";

// Tabs List
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-15 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

// Tabs Trigger
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      baseTriggerClasses,
      focusRingClasses,
      disabledClasses,
      activeTriggerClasses,
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

// Tabs Content
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background",
      focusRingClasses,
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

// Export all components
export { Tabs, TabsList, TabsTrigger, TabsContent };
