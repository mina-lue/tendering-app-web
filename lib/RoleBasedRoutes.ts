export function canAccess(role: 'ADMIN' | 'BUYER' | 'VENDOR', pathname: string) {
  if (role === "ADMIN") return true;

  // Vendor: tenders + profile
  if (role === "VENDOR") {
    return (
      pathname === "/tenders" ||
      pathname.startsWith("/tenders/") || // details
      pathname === "/profile"
    );
  }

  // Buyer: tenders + new + profile
  if (role === "BUYER") {
    return (
      pathname === "/tenders" ||
      pathname.startsWith("/tenders/") ||
      pathname === "/tenders/new" ||
      pathname === "/profile"
    );
  }

  return false;
}
