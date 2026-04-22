import { GoogleIcon } from "@/assets/google-icon";
import { Button } from "@/components/button";
import { DATA_TEST_IDS } from "@/e2e/consts";
import { useAuth } from "@/hooks/use-auth";

export const GoogleAuth = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <Button
      className=""
      variant="outline"
      size="sm"
      onClick={loginWithGoogle}
      data-testid={DATA_TEST_IDS.AUTH.GOOGLE_LOGIN_BUTTON}
    >
      <div className="flex items-center gap-2">
        <GoogleIcon />
        Continue with Google
      </div>
    </Button>
  );
};
