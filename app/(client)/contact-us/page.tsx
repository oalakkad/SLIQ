"use client";

import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Page() {
  const [isMobile] = useMediaQuery(["(max-width: 950px)"]);
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const toast = useToast(); // ✅ hooks at top level

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";
  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  const dir = isArabic ? "rtl" : "ltr";
  const align = isArabic ? "right" : "left";

  const t = useMemo(
    () =>
      isArabic
        ? {
            title: "تواصل معنا",
            subtitle: "أرسل لنا رسالة وسنعود إليك في أقرب وقت ممكن.",
            name: "الاسم",
            email: "البريد الإلكتروني",
            phone: "رقم الهاتف (اختياري)",
            subject: "العنوان",
            message: "الرسالة",
            submit: "إرسال",
            success: "تم إرسال رسالتك بنجاح!",
            error: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
            required: "هذا الحقل مطلوب",
            invalidEmail: "الرجاء إدخال بريد إلكتروني صالح",
            minMessage: "الرسالة يجب أن تكون على الأقل 10 أحرف",
          }
        : {
            title: "Contact Us",
            subtitle:
              "Send us a message and we’ll get back to you as soon as possible.",
            name: "Name",
            email: "Email",
            phone: "Phone (optional)",
            subject: "Subject",
            message: "Message",
            submit: "Send",
            success: "Your message has been sent!",
            error: "Something went wrong. Please try again.",
            required: "This field is required",
            invalidEmail: "Please enter a valid email",
            minMessage: "Message must be at least 10 characters",
          },
    [isArabic]
  );

  const validationSchema = Yup.object({
    name: Yup.string().required(t.required),
    email: Yup.string().email(t.invalidEmail).required(t.required),
    phone: Yup.string().max(50).nullable(),
    subject: Yup.string().required(t.required),
    message: Yup.string().min(10, t.minMessage).required(t.required),
  });

  return (
    <Box
      dir={dir}
      fontFamily={bodyFont}
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
      maxW="900px"
      mx="auto"
    >
      <VStack align={align} spacing={2} mb={8}>
        <Heading fontFamily={headingFont} size="lg" textAlign={align} w="full">
          {t.title}
        </Heading>
        <Text color="gray.600" textAlign={align} w="full">
          {t.subtitle}
        </Text>
      </VStack>

      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          try {
            await axios.post(`${API_URL}/api/contact/`, values, {
              withCredentials: true,
            });
            toast({ title: t.success, status: "success" });
            actions.resetForm();
          } catch (err) {
            toast({ title: t.error, status: "error" });
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4} flexDir={isMobile ? "column" : "row"}>
                <Field name="name">
                  {({ field }: any) => (
                    <FormControl
                      isInvalid={touched.name && !!errors.name}
                      isRequired
                    >
                      <FormLabel textAlign={align}>{t.name}</FormLabel>
                      <Input
                        {...field}
                        placeholder={t.name}
                        textAlign={align}
                      />
                      {touched.name && errors.name ? (
                        <Text color="red.500" mt={1} fontSize="sm">
                          {errors.name}
                        </Text>
                      ) : null}
                    </FormControl>
                  )}
                </Field>

                <Field name="email">
                  {({ field }: any) => (
                    <FormControl
                      isInvalid={touched.email && !!errors.email}
                      isRequired
                    >
                      <FormLabel textAlign={align}>{t.email}</FormLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t.email}
                        textAlign={align}
                      />
                      {touched.email && errors.email ? (
                        <Text color="red.500" mt={1} fontSize="sm">
                          {errors.email}
                        </Text>
                      ) : null}
                    </FormControl>
                  )}
                </Field>
              </HStack>

              <Field name="phone">
                {({ field }: any) => (
                  <FormControl>
                    <FormLabel textAlign={align}>{t.phone}</FormLabel>
                    <Input {...field} placeholder={t.phone} textAlign={align} />
                  </FormControl>
                )}
              </Field>

              <Field name="subject">
                {({ field }: any) => (
                  <FormControl
                    isInvalid={touched.subject && !!errors.subject}
                    isRequired
                  >
                    <FormLabel textAlign={align}>{t.subject}</FormLabel>
                    <Input
                      {...field}
                      placeholder={t.subject}
                      textAlign={align}
                    />
                    {touched.subject && errors.subject ? (
                      <Text color="red.500" mt={1} fontSize="sm">
                        {errors.subject}
                      </Text>
                    ) : null}
                  </FormControl>
                )}
              </Field>

              <Field name="message">
                {({ field }: any) => (
                  <FormControl
                    isInvalid={touched.message && !!errors.message}
                    isRequired
                  >
                    <FormLabel textAlign={align}>{t.message}</FormLabel>
                    <Textarea
                      {...field}
                      placeholder={t.message}
                      rows={6}
                      textAlign={align}
                    />
                    {touched.message && errors.message ? (
                      <Text color="red.500" mt={1} fontSize="sm">
                        {errors.message}
                      </Text>
                    ) : null}
                  </FormControl>
                )}
              </Field>

              <Button
                type="submit"
                colorScheme="brandBlue"
                w={"100%"}
                alignSelf={isArabic ? "flex-start" : "flex-end"}
                isLoading={isSubmitting}
              >
                {t.submit}
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
