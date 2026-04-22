import { useMemo } from "react";

import { useTheme } from "@/app/providers/theme-provider/theme-provider";
import darkModeLogo from "@/assets/company-icon-dark-mode.png";
import lightModeLogo from "@/assets/company-icon-light-mode.png";

type CompanyLogoProps = {
  className: string;
};

export const CompanyLogo = ({ className }: CompanyLogoProps) => {
  const theme = useTheme();

  const logoSrc = useMemo(() => {
    if (theme.isDarkMode) return darkModeLogo;
    return lightModeLogo;
  }, [theme]);

  return <img src={logoSrc} alt="Company Logo" className={className} />;
};
