import * as React from "react";
import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full border-collapse text-[14px]", className)} {...props} />
    </div>
  );
}
function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />;
}
function TableBody(props: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" {...props} />;
}
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("border-b border-divider hover:bg-ink/4", className)} {...props} />;
}
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn("p-s2 text-left text-[11px] font-normal uppercase tracking-[0.08em] text-ink/60", className)}
      {...props}
    />
  );
}
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("p-s2 align-middle", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
