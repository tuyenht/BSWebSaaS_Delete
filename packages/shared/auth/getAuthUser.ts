import type { Payload, User } from "payload";
import type { Request } from "express";

/**
 * Get authenticated user from Payload request context.
 * Returns null if user is not authenticated.
 */
export async function getAuthUser(
  payload: Payload,
  req?: Request,
): Promise<User | null> {
  try {
    if (!req) {
      return null;
    }

    // Use Payload's localAPI to get authenticated user
    const user = await payload.auth({
      headers: req.headers,
    });

    if (!user?.user) {
      return null;
    }

    return user.user as User;
  } catch (error) {
    // User is not authenticated
    return null;
  }
}

/**
 * Check if user has a specific role.
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false;

  const roles = user.roles || [];
  return Array.isArray(roles) ? roles.includes(role) : roles === role;
}

/**
 * Check if user has any of the specified roles.
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  if (!user) return false;

  const userRoles = user.roles || [];
  const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

  return roles.some((role) => userRolesArray.includes(role));
}

/**
 * Check if user has all of the specified roles.
 */
export function hasAllRoles(user: User | null, roles: string[]): boolean {
  if (!user) return false;

  const userRoles = user.roles || [];
  const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

  return roles.every((role) => userRolesArray.includes(role));
}

/**
 * Get user's tenant IDs.
 */
export function getUserTenantIds(user: User | null): string[] {
  if (!user) return [];

  const tenants = user.tenants || [];
  if (Array.isArray(tenants)) {
    return tenants.map((tenant) =>
      typeof tenant === "string" ? tenant : tenant.id,
    );
  }

  return [];
}

/**
 * Get user's site IDs.
 */
export function getUserSiteIds(user: User | null): string[] {
  if (!user) return [];

  const sites = user.sites || [];
  if (Array.isArray(sites)) {
    return sites.map((site) => (typeof site === "string" ? site : site.id));
  }

  return [];
}

