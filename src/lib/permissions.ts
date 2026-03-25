export type Role = 'OWNER' | 'ADMIN' | 'DEV' | 'MOD' | 'USER';

export const RoleHierarchy: Record<Role, number> = {
  OWNER: 4,
  ADMIN: 3,
  DEV: 2,
  MOD: 1,
  USER: 0
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
}

export function canManageServer(userRole: Role, isServerOwner: boolean): boolean {
  return isServerOwner || hasPermission(userRole, 'ADMIN');
}
