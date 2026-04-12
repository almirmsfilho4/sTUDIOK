'use client';

import { createContext, useContext, ReactNode } from 'react';

interface BreadcrumbContextType {
  setBreadcrumbs: (items: { label: string; href: string }[]) => void;
}

const AdminBreadcrumbContext = createContext<BreadcrumbContextType>({
  setBreadcrumbs: () => {},
});

export function AdminBreadcrumbProvider({ children }: { children: ReactNode }) {
  const setBreadcrumbs = () => {};

  return (
    <AdminBreadcrumbContext.Provider value={{ setBreadcrumbs }}>
      {children}
    </AdminBreadcrumbContext.Provider>
  );
}

export const useAdminBreadcrumb = () => useContext(AdminBreadcrumbContext);
