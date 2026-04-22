type AuthPageProps = {
  children: React.ReactNode;
};

export const AuthPage = ({ children }: AuthPageProps) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-100">{children}</div>
    </div>
  );
};
