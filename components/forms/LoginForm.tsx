"use client";

import { useLogin } from "@/hooks";
import { Form } from "@/components/forms";
import { useAppSelector } from "@/redux/hooks";

export default function LoginForm() {
  const { email, password, isLoading, onChange, onSubmit } = useLogin();

  const isArabic = useAppSelector((state) => state.lang.isArabic);

  const config = [
    {
      labelText: isArabic ? "البريد الإلكتروني" : "Email address",
      labelId: "email",
      type: "email",
      value: email,
      required: true,
    },
    {
      labelText: isArabic ? "كلمة السر" : "Password",
      labelId: "password",
      type: "password",
      value: password,
      link: {
        linkText: isArabic ? "نسيت كلمةالسر؟" : "Forgot password?",
        linkUrl: "/password-reset",
      },
      required: true,
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText={isArabic ? "تسجيل الدخول" : "Sign in"}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
