type Tab<T extends string> = { id: T; label: string };

type DashSidebarProps<T extends string> = {
  ariaLabel: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  links?: { href: string; label: string }[];
  onLogout: () => void;
};

const DashSidebar = <T extends string>({
  ariaLabel,
  eyebrow,
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  links = [],
  onLogout,
}: DashSidebarProps<T>) => (
  <aside className="dash-sidebar" aria-label={ariaLabel}>
    <div className="dash-sidebar__brand">
      {eyebrow && <span className="portal-tag">{eyebrow}</span>}
      <p className="dash-sidebar__title">{title}</p>
      {subtitle && <p className="dash-sidebar__subtitle">{subtitle}</p>}
    </div>

    <nav className="dash-sidebar__nav">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={`sidebar-link ${isActive ? "is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
      {links.map((link) => (
        <a key={link.href} href={link.href} className="sidebar-link">
          {link.label}
        </a>
      ))}
    </nav>

    <div className="dash-sidebar__footer">
      <button type="button" onClick={onLogout} className="btn-logout btn-full">
        Sign Out
      </button>
    </div>
  </aside>
);

export default DashSidebar;