import { Link } from "react-router-dom";

import { PageMetaTitle } from "@/app/layouts/page-layouts/page-meta-title";
import { Routes } from "@/app/routes/routes";
import { PRODUCT_NAME } from "@/lib/consts/products";
import { CompanyLogo } from "@/pages/auth/shared/company-logo";
import { GoogleAuth } from "@/pages/auth/shared/google-auth";
import { SendCode } from "@/pages/auth/shared/send-code";

export enum AuthContext {
  Login = "login",
  Signup = "signup",
}

const CONTEXT_MAPPER = {
  [AuthContext.Login]: {
    title: `Log in to ${PRODUCT_NAME}`,
    ctaRoute: Routes.AuthSignup,
    ctaPrefix: "Don't have an account?",
    ctaText: "Sign up",
  },
  [AuthContext.Signup]: {
    title: `Sign up for ${PRODUCT_NAME}`,
    ctaRoute: Routes.AuthLogin,
    ctaPrefix: "Already have an account?",
    ctaText: "Login",
  },
};

type AuthProps = {
  context: AuthContext;
};

export const AuthBase = ({ context }: AuthProps) => {
  const { title, ctaRoute, ctaPrefix, ctaText } = CONTEXT_MAPPER[context];

  return (
    <>
      <PageMetaTitle title={title} />
      <div className="grid gap-6">
        <CompanyLogo className="h-8" />
        <span className="text-2xl font-thin tracking-tight py-4">{title}</span>
        <GoogleAuth />
        <hr className="my-4" />
        <SendCode />
        <p className="text-sm text-muted-foreground py-4">
          {ctaPrefix}{" "}
          <Link
            to={ctaRoute}
            className="underline underline-offset-4 text-primary"
          >
            {ctaText}
          </Link>
          .
        </p>
      </div>
    </>
  );
};
