"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

import HeroBanner from "@/components/common/HeroBanner";
import AboutSection from "@/components/common/AboutSection";
import CategoryCard from "@/components/common/CategoryCard";
import FeaturedProductCarousel from "@/components/common/FeaturedCardCarousel";
import ThreeImages from "@/components/common/ThreeImages";

import type { ThreeImagesProps } from "@/components/common/ThreeImages";
import type { CategoryCardProps } from "@/components/common/CategoryCard";
import { useAppSelector } from "@/redux/hooks";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const generateImageSet = (start: number): ThreeImagesProps[] =>
  [0, 1, 2].map((i) => ({
    src: `${API_URL}/media/home/${start + i}.svg`,
    alt: `Image ${i + 1}`,
  }));

const imageGroups = [
  generateImageSet(1),
  generateImageSet(4),
  generateImageSet(7),
  generateImageSet(10),
  generateImageSet(13),
  generateImageSet(16),
];

export default function Page() {
  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);
  const { data: user } = useRetrieveUserQuery();
  const [loading, setLoading] = useState(true);
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const direction = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "right" : "left";
  const marginX = isArabic ? { ml: 0, mr: 6 } : { ml: 6, mr: 0 };

  const categories: CategoryCardProps[] = [
    {
      title: isArabic ? "مشابك الشعر" : "HAIR CLIPS",
      imageUrl: `${API_URL}/media/product-images/cotton-candy-gallery.jpg`,
      href: "/category/hair-clips",
    },
    {
      title: isArabic ? "فرش الشعر" : "HAIR BRUSHES",
      imageUrl: `${API_URL}/media/product-images/crushed-ice-brush-gallery.jpg`,
      href: "/category/hair-brushes",
    },
    {
      title: isArabic ? "مشابك جاهزة" : "PRE-MADE CLIPS",
      imageUrl: `${API_URL}/media/product-images/starfish-clip-gallery.jpg`,
      href: "/category/pre-made-clips",
    },
    {
      title: isArabic ? "حقائب المكياج" : "MAKEUP POUCHES",
      imageUrl: `${API_URL}/media/product-images/makeup-bags-gallery.jpg`,
      href: "/category/makeup-pouches",
    },
  ];

  const kidsProducts: CategoryCardProps[] = [
    {
      title: isArabic ? "الأخضر السعيد" : "HAPPY GREEN",
      imageUrl: `${API_URL}/media/product-images/happy-green_SwXvMVa.png`,
      href: "/products/happy-green",
    },
    {
      title: isArabic ? "الدببة البنفسجية" : "PURPLE BEARS",
      imageUrl: `${API_URL}/media/product-images/purple-bears_h77mWmn.png`,
      href: "/products/purple-bear",
    },
    {
      title: isArabic ? "الدببة السعيد" : "HAPPY BEARS",
      imageUrl: `${API_URL}/media/product-images/happy-bear_Pb3cpaC.png`,
      href: "/products/happy-bear",
    },
    {
      title: isArabic ? "أسود وردي" : "BLACK PINK",
      imageUrl: `${API_URL}/media/product-images/black-pink_YVEYYbt.png`,
      href: "/products/black-pink",
    },
  ];

  const t = {
    saleTitle: isArabic ? "خصم 25٪ على كل المنتجات" : "25% OFF SITEWIDE",
    saleDesc: isArabic
      ? "تسوقي مستلزمات الشعر الأساسية بخصم 25٪ حتى 6 يوليو. تطبق الشروط."
      : "Our Summer sale has arrived, take 25% off effortless hair essentials through July 6th. Exclusions apply.",
    shopNow: isArabic ? "تسوقي الآن" : "SHOP NOW",
    sweetSummer: isArabic ? "صيف حلو للشعر" : "SWEET SUMMER HAIR",
    summerDesc: isArabic
      ? "جربي إكسسوارات الشعر الصيفية والعناية الفائقة المنعشة."
      : "Refresh your summer hair wardrobe with sweet seasonal accessories and hair care.",
    sundrenched: isArabic ? "لأيام مشمسة" : "FOR SUN-DRENCHED DAYS",
    sunDesc: isArabic
      ? "استمتعي بعطر الشعر والهيدباند والمشابك الخفيفة."
      : "Take your hair from morning to golden hour with Aura Mist, headbands, and barrettes.",
    hairMilk: isArabic
      ? "تعرفي على هيڤنلي هير ميلك"
      : "MEET HEAVENLY HAIR MILK",
    milkDesc: isArabic
      ? "منتج رائع لفك التشابك والحماية من الحرارة والتقليل من التجعد."
      : "Pre-styling must-have that detangles, protects from heat, and reduces frizz.",
    flawlessDesc: isArabic
      ? "اكتشفي العناية بالشعر والفرش والإكسسوارات لفصل الإجازات."
      : "Hair care, accessories, and brushes for vacation-season long.",
    shopCategory: isArabic ? "تسوقي حسب الفئة" : "SHOP BY CATEGORY",
    inspiredBy: isArabic ? "مستوحى من" : "INSPIRED BY",
    inspiredDesc: isArabic
      ? "هيڤنلي هير ميلك يمنح شعرك النعومة والرائحة الفانيليا ويقلل التجعد."
      : '"Heavenly Hair Milk was formulated for soft, smooth and vanilla-scented hair..."',
    aboutUs: isArabic ? "من نحن" : "ABOUT US",
    aboutDesc: isArabic
      ? "علامة تجارية نسائية جريئة تدعمها منتجات عالية الجودة وفعالة وسهلة الاستخدام."
      : "A brand founded on bold femininity, offering effective and effortless products.",
    ourStory: isArabic ? "قصتنا" : "Our Story",
    kidsTitle: isArabic ? "الأطفال" : "KIDS",
  };

  useEffect(() => {
    const handlePageLoad = () => setLoading(false);
    if (document.readyState === "complete") handlePageLoad();
    else window.addEventListener("load", handlePageLoad);
    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  if (loading) {
    return (
      <Flex
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
        bg="white"
        position="fixed"
        top={0}
        left={0}
        zIndex={9999}
      >
        <Spinner color="brand.pink" size="xl" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box dir={direction}>
      <Box px={{ base: 4, md: 16 }} py={10} bg="brand.blue">
        <Heading
          color="gray.700"
          fontFamily={bodyFont}
          textAlign="center"
          size="lg"
          fontWeight={400}
          my={5}
        >
          {t.kidsTitle}
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} columnGap={6}>
          {kidsProducts.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </SimpleGrid>
      </Box>
      {imageGroups.slice(0, 5).map((images, i) => (
        <Box
          key={i}
          bg={
            [
              "brand.announcement",
              "brand.pink",
              "brand.announcement",
              "brand.border",
              "brand.blue",
            ][i]
          }
          pt={20}
          pb={4}
          px={5}
        >
          <ThreeImages images={images} />
          <Box w={isMobile ? "90%" : "30%"} {...marginX} textAlign={textAlign}>
            <Heading size="lg" color="gray.500" my={2} fontFamily={headingFont}>
              {
                [
                  t.saleTitle,
                  t.sweetSummer,
                  t.sundrenched,
                  t.hairMilk,
                  t.hairMilk,
                ][i]
              }
            </Heading>
            <Text fontWeight={100} color="black" fontFamily={bodyFont}>
              {
                [
                  t.saleDesc,
                  t.summerDesc,
                  t.sunDesc,
                  t.milkDesc,
                  t.flawlessDesc,
                ][i]
              }
            </Text>
            <Link href="/shop">
              <Button
                my={4}
                variant="outline"
                fontSize="sm"
                fontFamily={headingFont}
              >
                {t.shopNow}
              </Button>
            </Link>
          </Box>
        </Box>
      ))}

      <Box px={{ base: 4, md: 16 }} py={10}>
        <Heading
          color="gray.700"
          fontFamily={bodyFont}
          textAlign="center"
          size="lg"
          fontWeight={400}
          my={5}
        >
          {t.shopCategory}
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} columnGap={6}>
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </SimpleGrid>
      </Box>

      <HeroBanner
        title={t.inspiredBy}
        description={t.inspiredDesc}
        buttonText={t.shopNow}
        buttonLink="#"
        imageSrc={`${API_URL}/media/home/banner.svg`}
      />

      <AboutSection
        title={t.aboutUs}
        description={t.aboutDesc}
        buttonText={t.ourStory}
        buttonLink="/about"
        imageSrc={`${API_URL}/media/home/banner2.svg`}
      />
    </Box>
  );
}
