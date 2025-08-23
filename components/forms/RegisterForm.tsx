"use client";

import { useRegister } from "@/hooks";
import { Form } from "@/components/forms";
import { useAppSelector } from "@/redux/hooks";

export default function RegisterForm() {
  const {
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  } = useRegister();

  const isArabic = useAppSelector((state) => state.lang.isArabic);

  const config = [
    {
      labelText: isArabic ? "الاسم الأول" : "First name",
      labelId: "first_name",
      type: "text",
      value: first_name,
      required: true,
    },
    {
      labelText: isArabic ? "اسم العائلة" : "Last name",
      labelId: "last_name",
      type: "text",
      value: last_name,
      required: true,
    },
    {
      labelText: isArabic ? "البريد الإلكتروني" : "Email address",
      labelId: "email",
      type: "email",
      value: email,
      required: true,
    },
    {
      labelText: isArabic ? "كلمة المرور" : "Password",
      labelId: "password",
      type: "password",
      value: password,
      required: true,
    },
    {
      labelText: isArabic ? "تأكيد كلمة المرور" : "Confirm password",
      labelId: "re_password",
      type: "password",
      value: re_password,
      required: true,
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText={isArabic ? "انشاء حساب" : "Sign up"}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
