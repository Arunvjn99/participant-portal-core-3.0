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

export interface Profile {
  id: string;
  name: string;
  company_id: string;
  location: string;
}

export interface Company {
  id: string;
  name: string;
  brand_primary: string | null;
  brand_secondary: string | null;
  style_config?: string | null;
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
  const { setCompanyBranding } = useTheme();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      setProfile(null);
      setCompany(null);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    const fetchUserData = async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, company_id, location")
        .eq("id", authUser.id)
        .single();

      if (cancelled) return;

      if (profileError || !profileData) {
        setProfile(null);
        setCompany(null);
        setProfileLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: companyData } = await supabase
        .from("companies")
        .select("id, name, brand_primary, brand_secondary, style_config")
        .eq("id", profileData.company_id)
        .single();

      if (cancelled) return;

      const company = companyData as Company | null;
      setCompany(company);

      if (company?.name) {
        setCompanyBranding(company.name, company.style_config);
      }

      setProfileLoading(false);
    };

    fetchUserData();
    return () => { cancelled = true; };
  }, [authUser, authLoading, setCompanyBranding]);

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
