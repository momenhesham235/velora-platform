import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Velora Breadcrumbs — flat ordered navigation crumb trail.
 *
 * Pure-custom (no HeroUI): breadcrumbs don't need focus traps, portals,
 * or keyboard collection management. A nav + ordered list is enough.
 *
 * Usage:
 *   <Breadcrumbs items={[
 *     { label: 'Workspaces', to: '/workspaces' },
 *     { label: 'Acme Co', to: '/workspaces/acme' },
 *     { label: 'Mobile App' },          // no `to` → current page
 *   ]} />
 *
 * The last item is always rendered as plain text with aria-current="page",
 * even if a `to` is provided — the active page is never a link.
 */
export interface BreadcrumbItem {
  label: ReactNode;
  to?: string;
  /** Optional leading icon (16x16) shown before the label. */
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Visual separator between crumbs. Defaults to a chevron. */
  separator?: ReactNode;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator,
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const sep = separator ?? <ChevronSeparator />;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <li className="flex items-center">
                {isLast || !item.to ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-medium',
                      isLast ? 'text-foreground' : 'text-default-500',
                    ].join(' ')}
                  >
                    {item.icon}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-default-500 transition-colors hover:bg-content2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li aria-hidden className="flex items-center text-default-500/60">
                  {sep}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

function ChevronSeparator() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path
        d="m8 5 4 5-4 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
