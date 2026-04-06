/**
 * UserContext: profile + company for the current auth user.
 * - Profile is fetched from public.profiles (id, name, company_id, location, role).
 * - Company is fetched from public.companies using profile.company_id (UUID).
 * - Branding is applied from companies.branding_json, logo_url, primary_color, secondary_color only.
 * - No company_branding table is used; theme is applied after login and on page refresh.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { useDemoUser } from "@/hooks/useDemoUser";
import { supabase } from "../lib/supabase";

export interface Profile {
  id: string;
  name: string;
  company_id: string | null;
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
  /** Enrollment state from `enrollments` row when present (`status` or `enrollment_status` if available). */
  enrollmentStatus: string | null;
  loading: boolean;
  refreshEnrollment: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

function pickEnrollmentStatus(row: unknown): string | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  if (typeof r.status === "string") return r.status;
  if (typeof r.enrollment_status === "string") return r.enrollment_status;
  return null;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, session, loading: authLoading } = useAuth();
  const { setCompanyBranding, setBrandingLoading } = useTheme();
  const demoUser = useDemoUser();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshEnrollment = useCallback(async () => {
    if (!supabase || !authUser?.id) return;
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle();
    if (error) {
      console.warn("Enrollment fetch failed:", error.message);
      setEnrollmentStatus(null);
      return;
    }
    setEnrollmentStatus(pickEnrollmentStatus(data));
  }, [authUser?.id]);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser || !session) {
      if (demoUser) {
        setProfile(null);
        setCompany(null);
        setEnrollmentStatus(null);
        setBrandingLoading(false);
        setProfileLoading(false);
        return;
      }
      setProfile(null);
      setCompany(null);
      setEnrollmentStatus(null);
      setBrandingLoading(false);
      setProfileLoading(false);
      if (typeof document?.documentElement?.style?.removeProperty === "function") {
        document.documentElement.style.removeProperty("--color-primary");
        document.documentElement.style.removeProperty("--color-secondary");
      }
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    const fetchUserData = async () => {
      if (!supabase) {
        setProfile(null);
        setCompany(null);
        setEnrollmentStatus(null);
        setBrandingLoading(false);
        setProfileLoading(false);
        return;
      }

      const enrollmentPromise = supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", authUser.id)
        .maybeSingle()
        .then((res): string | null => {
          if (res.error) {
            console.warn("Enrollment fetch failed:", res.error.message);
            return null;
          }
          return pickEnrollmentStatus(res.data);
        });

      try {
      if (import.meta.env.DEV) console.log("[user-diag] fetching profile for", authUser.id);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, company_id, location, role")
        .eq("id", authUser.id)
        .maybeSingle();

      if (import.meta.env.DEV) console.log("[user-diag] profile result:", { profileData, profileError });
      if (cancelled) return;

      if (profileError) {
        if (import.meta.env.DEV) console.error("[user-diag] profile fetch failed:", profileError);
        setProfile(null);
        setCompany(null);
        setBrandingLoading(false);
        setProfileLoading(false);
        return;
      }

      let profileDataToUse = profileData;

      // Auto-create profile on first login if row does not exist (e.g. after email verification)
      if (!profileDataToUse) {
        const meta = authUser.user_metadata as Record<string, unknown> | undefined;
        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: authUser.id,
              name: (meta?.name as string) ?? "",
              company_id: (meta?.company_id as string) ?? null,
              location: (meta?.location as string) ?? "",
              role: "user",
            },
            { onConflict: "id" }
          );
        if (cancelled) return;
        if (upsertError) {
          if (import.meta.env.DEV) console.error("[user-diag] profile upsert failed:", upsertError);
          setProfile(null);
          setCompany(null);
          setBrandingLoading(false);
          setProfileLoading(false);
          return;
        }
        const { data: refetched, error: refetchError } = await supabase
          .from("profiles")
          .select("id, name, company_id, location, role")
          .eq("id", authUser.id)
          .single();
        if (cancelled) return;
        if (refetchError || !refetched) {
          if (import.meta.env.DEV) console.error("[user-diag] profile refetch after upsert failed:", refetchError);
          setProfile(null);
          setCompany(null);
          setBrandingLoading(false);
          setProfileLoading(false);
          return;
        }
        profileDataToUse = refetched;
      }

      setProfile(profileDataToUse);

      if (import.meta.env.DEV) {
        console.log("[user-diag] profile.company_id:", profileDataToUse.company_id);
      }

      // Defensive: missing company_id → do not load company theme; use default
      if (!profileDataToUse.company_id?.trim()) {
        if (import.meta.env.DEV) {
          console.warn("[UserContext] profile.company_id is missing; company branding will not be applied. User may need to complete signup or have profile updated.");
        }
        setCompany(null);
        setCompanyBranding("", undefined);
        setBrandingLoading(false);
        setProfileLoading(false);
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, primary_color, secondary_color, branding_json, logo_url")
        .eq("id", profileDataToUse.company_id)
        .single();

      if (import.meta.env.DEV) console.log("[user-diag] company result:", { companyData, companyError });
      if (cancelled) return;

      if (companyError || !companyData) {
        if (import.meta.env.DEV) {
          console.warn("[UserContext] company fetch failed for company_id:", profileDataToUse.company_id, companyError);
        }
        setCompany(null);
        setCompanyBranding("", undefined);
        setBrandingLoading(false);
        setProfileLoading(false);
        return;
      }

      const company = companyData as Company;
      setCompany(company);

      // Apply theme from companies.branding_json and companies.logo_url
      // Column-level primary_color/secondary_color are passed as overrides
      // so they're applied in a single pass (no flash from double-write).
      setCompanyBranding(
        company.name,
        company.branding_json ?? undefined,
        company.logo_url ?? null,
        company.primary_color?.trim() || undefined,
        company.secondary_color?.trim() || undefined,
      );
      setBrandingLoading(false);
      setProfileLoading(false);
      } finally {
        const status = await enrollmentPromise;
        if (!cancelled) setEnrollmentStatus(status);
      }
    };

    fetchUserData();
    return () => { cancelled = true; };
  }, [authUser, authLoading, session, demoUser, setCompanyBranding, setBrandingLoading]);

  const loading = demoUser ? false : authLoading || profileLoading;

  const value = useMemo(() => {
    let effectiveProfile = profile;
    let effectiveEnrollment = enrollmentStatus;
    if (demoUser) {
      effectiveProfile = {
        id: demoUser.id,
        name: demoUser.name,
        company_id: profile?.company_id ?? null,
        location: profile?.location ?? "",
        role: profile?.role ?? "user",
      };
      effectiveEnrollment =
        demoUser.enrollmentStatus === "not_enrolled" ? null : "completed";
    }
    return {
      user: authUser,
      profile: effectiveProfile,
      company: demoUser ? null : company,
      enrollmentStatus: effectiveEnrollment,
      loading,
      refreshEnrollment,
    };
  }, [authUser, profile, company, enrollmentStatus, loading, refreshEnrollment, demoUser]);

  return (
    <UserContext.Provider value={value}>
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
