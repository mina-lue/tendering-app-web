
export function canAccess(role: 'ADMIN' | 'BUYER' | 'VENDOR', pathname: string) {
  if (role === "ADMIN") return true;


  if (role === "VENDOR") {
    return (
      pathname === "/tenders" ||
      (pathname.startsWith("/tenders/") && pathname !== "/tenders/new" ) || 
      pathname === "/profile"
    );
  }


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
