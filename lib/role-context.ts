// Mock role-based access control
// In production, this would come from authentication
export type Role = "Admin" | "Sales" | "Workshop" | "Manager";

// Get current user role (mocked)
export function getCurrentRole(): Role {
  const role = process.env.NEXT_PUBLIC_CURRENT_ROLE as Role;
  return role || "Admin";
}

// Permission checking
export const PERMISSIONS = {
  Admin: {
    canViewDashboard: true,
    canCreateBills: true,
    canEditBills: true,
    canDeleteBills: true,
    canViewInventory: true,
    canEditInventory: true,
    canViewWorkshop: true,
    canEditWorkshop: true,
    canViewReports: true,
    canExportReports: true,
  },
  Sales: {
    canViewDashboard: true,
    canCreateBills: true,
    canEditBills: true,
    canDeleteBills: false,
    canViewInventory: true,
    canEditInventory: false,
    canViewWorkshop: false,
    canEditWorkshop: false,
    canViewReports: false,
    canExportReports: false,
  },
  Workshop: {
    canViewDashboard: false,
    canCreateBills: false,
    canEditBills: false,
    canDeleteBills: false,
    canViewInventory: false,
    canEditInventory: false,
    canViewWorkshop: true,
    canEditWorkshop: true,
    canViewReports: false,
    canExportReports: false,
  },
  Manager: {
    canViewDashboard: true,
    canCreateBills: false,
    canEditBills: false,
    canDeleteBills: false,
    canViewInventory: true,
    canEditInventory: false,
    canViewWorkshop: true,
    canEditWorkshop: false,
    canViewReports: true,
    canExportReports: true,
  },
};

export function hasPermission(role: Role, permission: keyof (typeof PERMISSIONS)[Role]): boolean {
  return PERMISSIONS[role][permission] || false;
}
