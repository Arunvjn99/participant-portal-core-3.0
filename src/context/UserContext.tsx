import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { supabase } from "../lib/supabase";
import { getCompanyBranding } from "../services/companyBrandingService";
import { generateDarkTheme } from "../theme/utils";
import type { ThemeColors } from "../theme/utils";
import type { SerializedBranding } from "../pages/settings/theme-editor/serialization";

export interface Profile {
  id: string;
  name: string;
  company_id: string;
  location: string;
  /** For RLS / permission checks; assume column exists on profiles */
  role?: string;
}

export interface Company {
  id: string;
  name: string;
  primary_color: string | null;
  secondary_color: string | null;
  branding_json?: Record<string, unknown> | null;
  logo_url?: string | null;
}

interface UserContextValue {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const { setCompanyBranding, setBrandingLoading } = useTheme();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      setProfile(null);
      setCompany(null);
      setBrandingLoading(false);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    const fetchUserData = async () => {
      if (import.meta.env.DEV) console.log("[user-diag] fetching profile for", authUser.id);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, company_id, location, role")
        .eq("id", authUser.id)
        .single();

      if (import.meta.env.DEV) console.log("[user-diag] profile result:", { profileData, profileError });
      if (cancelled) return;

      if (profileError || !profileData) {
        if (import.meta.env.DEV) console.error("[user-diag] profile fetch failed:", profileError);
        setProfile(null);
        setCompany(null);
        setBrandingLoading(false);
        setProfileLoading(false);
        return;
      }

      setProfile(profileData);

      // STEP 1: Log profile → company linkage for logo audit
      if (import.meta.env.DEV) {
        console.log("[logo-audit] user.id:", authUser.id, "profile.company_id:", profileData.company_id);
      }

      if (import.meta.env.DEV) console.log("[user-diag] fetching company for", profileData.company_id);
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, primary_color, secondary_color, branding_json, logo_url")
        .eq("id", profileData.company_id)
        .single();

      if (import.meta.env.DEV) console.log("[user-diag] company result:", { companyData, companyError });
      if (cancelled) return;

      const company = companyData as Company | null;
      setCompany(company);

      // PHASE 3: Temporary DEV logging — user → company → logo
      if (import.meta.env.DEV) {
        console.log("[logo-audit] user.id:", authUser?.id);
        console.log("[logo-audit] profile.company_id:", profileData?.company_id);
        console.log("[logo-audit] company row:", companyData);
        console.log("[logo-audit] company.logo_url:", companyData?.logo_url);
      }

      // setCompanyBranding(company.name, theme, company.logo_url) — logo from Supabase
      if (company?.name) {
        const logoUrl = company.logo_url?.trim() || "";
        const brandingPayload = await getCompanyBranding(company.id);
        if (cancelled) return;
        if (brandingPayload && typeof brandingPayload === "object" && brandingPayload.light) {
          const light: ThemeColors = {
            ...(brandingPayload as SerializedBranding).light,
            logo: logoUrl,
          };
          const dark = generateDarkTheme(light);
          setCompanyBranding(company.name, { light, dark }, company.logo_url);
        } else {
          setCompanyBranding(company.name, company.branding_json, company.logo_url);
        }
      }
      setBrandingLoading(false);
      setProfileLoading(false);
    };

    fetchUserData();
    return () => { cancelled = true; };
  }, [authUser, authLoading, setCompanyBranding, setBrandingLoading]);

  const loading = authLoading || profileLoading;

  return (
    <UserContext.Provider value={{ user: authUser, profile, company, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
