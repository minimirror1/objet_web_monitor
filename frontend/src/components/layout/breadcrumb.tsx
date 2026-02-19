import Link from "next/link";

type Crumb = {
  href?: string; // 생략하면 현재 페이지(링크 없는 텍스트)로 표시
  label: string;
};

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-muted-foreground/50">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
