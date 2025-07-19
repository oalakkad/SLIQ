"use client";

import AboutSection from "@/components/common/AboutSection";
import CategoryCard, {
  CategoryCardProps,
} from "@/components/common/CategoryCard";
import FeaturedCard from "@/components/common/FeaturedCard";
import FeaturedProductCarousel from "@/components/common/FeaturedCardCarousel";
import HeroBanner from "@/components/common/HeroBanner";
import ThreeImages, { ThreeImagesProps } from "@/components/common/ThreeImages";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";

const images: ThreeImagesProps[] = [
  {
    src: "https://www.emijay.com/cdn/shop/files/image18_edit.jpg?v=1750887075&width=1080",
    alt: "Image 1",
  },
  {
    src: "https://www.emijay.com/cdn/shop/files/image21_edit.jpg?v=1750887075&width=1080",
    alt: "Image 2",
  },
  {
    src: "https://www.emijay.com/cdn/shop/files/image12_edit.jpg?v=1750887074&width=1080",
    alt: "Image 3",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const images1: ThreeImagesProps[] = [
  {
    src: `${API_URL}/media/home/1.svg`,
    alt: "Image 1",
  },
  {
    src: `${API_URL}/media/home/2.svg`,
    alt: "Image 2",
  },
  {
    src: `${API_URL}/media/home/3.svg`,
    alt: "Image 3",
  },
];

const images2: ThreeImagesProps[] = [
  {
    src: `${API_URL}/media/home/4.svg`,
    alt: "Image 1",
  },
  {
    src: `${API_URL}/media/home/5.svg`,
    alt: "Image 2",
  },
  {
    src: `${API_URL}/media/home/6.svg`,
    alt: "Image 3",
  },
];

const images3: ThreeImagesProps[] = [
  {
    src: `${API_URL}/media/home/7.svg`,
    alt: "Image 1",
  },
  {
    src: `${API_URL}/media/home/8.svg`,
    alt: "Image 2",
  },
  {
    src: `${API_URL}/media/home/9.svg`,
    alt: "Image 3",
  },
];

const images4: ThreeImagesProps[] = [
  {
    src: `${API_URL}/media/home/10.svg`,
    alt: "Image 1",
  },
  {
    src: `${API_URL}/media/home/11.svg`,
    alt: "Image 2",
  },
  {
    src: `${API_URL}/media/home/12.svg`,
    alt: "Image 3",
  },
];

const images5: ThreeImagesProps[] = [
  {
    src: `${API_URL}/media/home/13.svg`,
    alt: "Image 1",
  },
  {
    src: `${API_URL}/media/home/14.svg`,
    alt: "Image 2",
  },
  {
    src: `${API_URL}/media/home/15.svg`,
    alt: "Image 3",
  },
];

const images6: ThreeImagesProps[] = [
  {
    src: `${API_URL}/media/home/16.svg`,
    alt: "Image 1",
  },
  {
    src: `${API_URL}/media/home/17.svg`,
    alt: "Image 2",
  },
  {
    src: `${API_URL}/media/home/17.svg`,
    alt: "Image 3",
  },
];

const categories: CategoryCardProps[] = [
  {
    title: "HAIR CLIPS",
    imageUrl: `${API_URL}/media/product-images/cotton-candy-gallery.jpg`,
    href: "/category/hair-clips",
  },
  {
    title: "HAIR BRUSHES",
    imageUrl: `${API_URL}/media/product-images/crushed-ice-brush-gallery.jpg`,
    href: "/category/hair-brushes",
  },
  {
    title: "PRE-MADE CLIPS",
    imageUrl: `${API_URL}/media/product-images/starfish-clip-gallery.jpg`,
    href: "/category/pre-made-clips",
  },
  {
    title: "MAKEUP POUCHES",
    imageUrl: `${API_URL}/media/product-images/makeup-bags-gallery.jpg`,
    href: "/category/makeup-pouches",
  },
];

export default function Page() {
  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  console.log(user);

  return (
    <Box>
      <Box bg={"brand.announcement"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images1} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            25% OFF SITEWIDE
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Our Summer sale has arrived, take 25% off effortless hair essentials
            through July 6th. Exclusions apply.
          </Text>
          <Link href={"/shop"}>
            <Button my={4} variant={"outline"} fontSize={"sm"}>
              SHOP NOW
            </Button>
          </Link>
        </Box>
      </Box>
      <Box bg={"brand.pink"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images2} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"Sweet Summer Hair".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Slow down and refresh your summer hair wardrobe with sweet seasonal
            accessories and heaven-sent hair care.
          </Text>
          <Link href={"/shop"}>
            <Button my={4} variant={"outline"} fontSize={"sm"}>
              SHOP NOW
            </Button>
          </Link>
        </Box>
      </Box>
      <Box bg={"brand.announcement"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images3} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"For Sun-drenched Days".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Take your hair from early morning to golden hour with Aura Hair
            Mist, gingham-printed headbands and airy bow barrettes.
          </Text>
          <Link href={"/shop"}>
            <Button my={4} variant={"outline"} fontSize={"sm"}>
              SHOP NOW
            </Button>
          </Link>
        </Box>
      </Box>
      <Box bg={"brand.border"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images4} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"Meet Heavenly Hair Milk".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Your new pre-styling must-have that helps detangle and protect
            against heat, while reducing frizz and drying time for deliciously
            silky hair.
          </Text>
          <Link href={"/shop"}>
            <Button my={4} variant={"outline"} fontSize={"sm"}>
              SHOP NOW
            </Button>
          </Link>
        </Box>
      </Box>
      {/* <FeaturedProductCarousel title="Summer Hair Essentials" /> */}
      <Box bg={"brand.blue"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images5} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"Meet Heavenly Hair Milk".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Discover hair care, accessories and brushes for flawless hair all
            vacation-season long.
          </Text>
          <Link href={"/shop"}>
            <Button my={4} variant={"outline"} fontSize={"sm"}>
              SHOP NOW
            </Button>
          </Link>
        </Box>
      </Box>
      <Box px={{ base: 4, md: 16 }} py={10}>
        <Heading
          color={"gray.700"}
          fontFamily={"Work Sans"}
          textAlign={"center"}
          size={"lg"}
          fontWeight={400}
          my={5}
        >
          SHOP BY CATEGORY
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} columnGap={6}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.title}
              title={cat.title}
              imageUrl={cat.imageUrl}
              href={cat.href}
            />
          ))}
        </SimpleGrid>
      </Box>
      <HeroBanner
        title="INSPIRED BY"
        description={`"Heavenly Hair Milk was formulated for soft, smooth and vanilla-scented hair. We wanted a styling product that not only preps and protects your hair, but aids in anti-frizz and detangling. Whether you're crafting a bouncy blowout, or just letting your hair air dry, you'll always be able to find a place for Heavenly Hair Milk in your routine."`}
        buttonText="Explore Heavenly Hair Milk"
        buttonLink="#"
        imageSrc={`${API_URL}/media/home/banner.svg`}
      />
      <AboutSection
        title="ABOUT US"
        description="A brand founded on bold femininity, supported by high-quality products. Both effective and effortless, Emi Jay takes a rare approach to hair and beauty, offering reliable products and a strong community."
        buttonText="Our Story"
        buttonLink="/about"
        imageSrc={`${API_URL}/media/home/banner2.svg`}
      />
    </Box>
  );
}
