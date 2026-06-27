import { auth } from "@/lib/auth";

export async function requireSuperAdmin() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return false;
  }

  const role = (session.user as any).role;
  const isAdminRole = role === "ADMIN" || role === "SUPERADMIN";
  
  const adminEmails = process.env.ADMIN_EMAILS 
    ? process.env.ADMIN_EMAILS.split(",").map(e => e.trim().toLowerCase()) 
    : [];
    
  const isEmailAdmin = adminEmails.includes(session.user.email.toLowerCase());

  // Return true if either condition is met
  // If we are in dev and DATABASE_URL is not set, mock it to true for UI testing
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === "development") {
    return true; 
  }

  return isAdminRole || isEmailAdmin;
}
