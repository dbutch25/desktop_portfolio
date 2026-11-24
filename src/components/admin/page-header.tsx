export function PageHeader({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-s6 flex flex-wrap items-end justify-between gap-s3 border-b border-divider pb-s4">
      <div>
        <div className="kicker">{kicker}</div>
        <h1 className="m-0 mt-1 text-[40px] leading-none font-normal">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-s2">{children}</div>}
    </div>
  );
}
