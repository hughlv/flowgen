import { siteConfig } from '@/config/site';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <>
      <title>{`${heading} - ${siteConfig.name}`}</title>
      <div className="flex items-center justify-between px-2 w-full">
        <div className="grid gap-1 py-2">
          <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
    </>
  );
}
