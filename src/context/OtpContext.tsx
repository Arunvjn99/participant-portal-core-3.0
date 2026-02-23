import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "otp_verified";

interface OtpContextValue {
  isOtpVerified: boolean;
  setOtpVerified: (value: boolean) => void;
  resetOtp: () => void;
}

const OtpContext = createContext<OtpContextValue | null>(null);

export function OtpProvider({ children }: { children: ReactNode }) {
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(
    () => sessionStorage.getItem(STORAGE_KEY) === "true",
  );

  const setOtpVerified = useCallback((value: boolean) => {
    setIsOtpVerified(value);
    if (value) {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const resetOtp = useCallback(() => {
    setIsOtpVerified(false);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <OtpContext.Provider value={{ isOtpVerified, setOtpVerified, resetOtp }}>
      {children}
    </OtpContext.Provider>
  );
}

export function useOtp(): OtpContextValue {
  const ctx = useContext(OtpContext);
  if (!ctx) {
    throw new Error("useOtp must be used within an OtpProvider");
  }
  return ctx;
}
