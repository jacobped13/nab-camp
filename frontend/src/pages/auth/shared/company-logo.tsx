import campAlertLogo from "@/assets/camp-alert.svg";

type CompanyLogoProps = {
  className: string;
};

export const CompanyLogo = ({ className }: CompanyLogoProps) => {
  return <img src={campAlertLogo} alt="Company Logo" className={className} />;
};
