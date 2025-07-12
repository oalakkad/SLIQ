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

const categories: CategoryCardProps[] = [
  {
    title: "HAIR BRUSHES",
    imageUrl:
      "https://www.emijay.com/cdn/shop/files/image1_4242b237-3646-4d06-881f-7f97aff371eb.jpg?v=1745253381&width=1024",
  },
  {
    title: "HAIR CARE",
    imageUrl:
      "https://www.emijay.com/cdn/shop/files/image15_5d09447b-625a-4e85-a7e7-675557a0d55e.jpg?v=1745253409&width=1024",
  },
  {
    title: "MAKEUP CLIPS",
    imageUrl:
      "https://www.emijay.com/cdn/shop/files/image8_9d4ec8a4-5049-4a97-a444-4dbcc45a4c0f.jpg?v=1745253449&width=1024",
  },
  {
    title: "TRAVEL POUCHES",
    imageUrl:
      "https://www.emijay.com/cdn/shop/files/image9_396707ab-08bc-4eef-8ab7-49557b6596e4.jpg?v=1745352482&width=1024",
  },
];

export default function Page() {
  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  console.log(user);

  return (
    <Box>
      <Box bg={"brand.announcement"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            25% OFF SITEWIDE
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Our Summer sale has arrived, take 25% off effortless hair essentials
            through July 6th. Exclusions apply.
          </Text>
          <Button my={4} variant={"outline"} fontSize={"sm"}>
            SHOP NOW
          </Button>
        </Box>
      </Box>
      <Box bg={"brand.pink"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"Sweet Summer Hair".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Slow down and refresh your summer hair wardrobe with sweet seasonal
            accessories and heaven-sent hair care.
          </Text>
          <Button my={4} variant={"outline"} fontSize={"sm"}>
            SHOP NOW
          </Button>
        </Box>
      </Box>
      <Box bg={"brand.announcement"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"For Sun-drenched Days".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Take your hair from early morning to golden hour with Aura Hair
            Mist, gingham-printed headbands and airy bow barrettes.
          </Text>
          <Button my={4} variant={"outline"} fontSize={"sm"}>
            SHOP NOW
          </Button>
        </Box>
      </Box>
      <Box bg={"brand.border"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"Meet Heavenly Hair Milk".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Your new pre-styling must-have that helps detangle and protect
            against heat, while reducing frizz and drying time for deliciously
            silky hair.
          </Text>
          <Button my={4} variant={"outline"} fontSize={"sm"}>
            SHOP NOW
          </Button>
        </Box>
      </Box>
      <FeaturedProductCarousel title="Summer Hair Essentials" />
      <Box bg={"brand.blue"} pt={20} pb={4} w={"100%"} px={5}>
        <ThreeImages images={images} />
        <Box w={isMobile ? "90%" : "30%"} m={6}>
          <Heading size={"lg"} color={"gray.500"} my={2}>
            {"Meet Heavenly Hair Milk".toUpperCase()}
          </Heading>
          <Text fontWeight={100} fontStyle={"normal"} color={"black"}>
            Discover hair care, accessories and brushes for flawless hair all
            vacation-season long.
          </Text>
          <Button my={4} variant={"outline"} fontSize={"sm"}>
            SHOP NOW
          </Button>
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
            />
          ))}
        </SimpleGrid>
      </Box>
      <HeroBanner
        title="INSPIRED BY"
        description={`"Heavenly Hair Milk was formulated for soft, smooth and vanilla-scented hair. We wanted a styling product that not only preps and protects your hair, but aids in anti-frizz and detangling. Whether you're crafting a bouncy blowout, or just letting your hair air dry, you'll always be able to find a place for Heavenly Hair Milk in your routine."`}
        buttonText="Explore Heavenly Hair Milk"
        buttonLink="#"
        imageSrc="https://www.emijay.com/cdn/shop/files/image7_490c246f-4d0b-47ab-9066-27b965ab3fd1.jpg?v=1745253531&width=2048"
      />
      <AboutSection
        title="ABOUT US"
        description="A brand founded on bold femininity, supported by high-quality products. Both effective and effortless, Emi Jay takes a rare approach to hair and beauty, offering reliable products and a strong community."
        buttonText="Our Story"
        buttonLink="/about"
        imageSrc="https://www.emijay.com/cdn/shop/files/BTSJG3_crop.jpg?v=1697052724&width=1024" // Place this image in /public
      />
    </Box>
  );
}
