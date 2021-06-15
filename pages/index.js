import Head from "next/head";
import {
  Flex,
  Heading,
  Input,
  Button,
  Checkbox,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
  useClipboard,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, CopyIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useRef, useEffect, useState } from "react";
export default function Home() {
  const [linkValue, setLinkValue] = useState("");
  const { toggleColorMode } = useColorMode();
  const toast = useToast();
  const linkInputRef = useRef(null);
  const { hasCopied, onCopy } = useClipboard(linkValue);
  const [zwsOn, setZws] = useState(false);
  const handleForm = async () => {
    if (linkInputRef.current.value == "") return;
    const res = await fetch("/api/create", {
      body: JSON.stringify({
        link: linkInputRef.current.value,
        zws: zwsOn,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error, short_link } = await res.json();
    if (error) {
      toast({
        title: "Error!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (short_link)
      setLinkValue(`${process.env.NEXT_PUBLIC_PROJECT_URL}/${short_link}`);
    linkInputRef.current.value = "";
    toast({
      title: "Link created.",
      description: `Your link is ready at ${process.env.NEXT_PUBLIC_PROJECT_URL}/${short_link}`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      toggleColorMode();
    }
  }, []);

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Head>
        <title>linki</title>
        <meta name="title" content="linki" />
        <meta name="description" content="linki: a place for your links" />
        <meta name="og:image" content="/linki.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        direction="column"
        background={useColorModeValue("gray.400", "gray.700")}
        p={10}
        rounded={6}
      >
        <Button colorScheme="teal" onClick={toggleColorMode} ml={48} mb={-10}>
          {useColorModeValue(<MoonIcon />, <SunIcon />)}
        </Button>
        <Heading mb={6} color="blue.500">
          linki
        </Heading>
        <Input
          ref={linkInputRef}
          variant="filled"
          mb={3}
          type="url"
          placeholder="Long URL (max 500 chars)"
          isRequired
        />
        <Input
          value={linkValue}
          variant="filled"
          mb={3}
          type="url"
          placeholder="shortened link"
          isReadOnly
        />
        <Checkbox
          onChange={(event) => {
            setZws(event.target.checked);
          }}
          colorScheme="teal"
          mb={4}
          mt={2}
          ml={20}
        >
          invisible link
        </Checkbox>
        <Button colorScheme="blue" onClick={onCopy} mb={10} ml={64}>
          {hasCopied ? <CheckCircleIcon /> : <CopyIcon />}
        </Button>
        <Button onClick={handleForm} colorScheme="teal" mr={20} mt={-20}>
          Shorten
        </Button>
        <Text as="u" as="a" ml={10} mt={6} href="https://github.com/rpxs/linki">
          a project by fish and friends
        </Text>
      </Flex>
    </Flex>
  );
}
