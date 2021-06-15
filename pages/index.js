import {CheckCircleIcon, CopyIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Input,
  useClipboard,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import {useEffect, useRef} from "react";

export default function Home() {
  const {toggleColorMode} = useColorMode();
  const toast = useToast();
  const linkInputRef = useRef(null);
  const shortRef = useRef(0);
  const {hasCopied, onCopy} = useClipboard(shortRef.current.value);
  const handleForm = async () => {
    if (linkInputRef.current.value == "")
      return;
    const res = await fetch("/api/create", {
      body : JSON.stringify({
        link : linkInputRef.current.value,
      }),
      headers : {
        "Content-Type" : "application/json",
      },
      method : "POST",
    });

    const {error, short_link} = await res.json();
    if (error) {
      toast({
        title : "Error!",
        description : error,
        status : "error",
        duration : 5000,
        isClosable : true,
      });
      return;
    } else if (short_link)
      shortRef.current.value = `${process.env.PROJECT_URL}/${short_link}`;
    linkInputRef.current.value = "";
    toast({
      title : "Link created.",
      description :
          `Your link is ready at ${process.env.PROJECT_URL}/${short_link}`,
      status : "success",
      duration : 5000,
      isClosable : true,
    });
  };

  useEffect(() => {
    if (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
      toggleColorMode();
    }
  }, []);

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex
  direction = "column"
  background = {useColorModeValue("gray.400", "gray.700")} p = {10} rounded =
      {6} >
      <Button colorScheme =
           "teal" onClick = {toggleColorMode} ml = {48} mb = {-10}>{
          useColorModeValue(<MoonIcon />, <SunIcon />)}<
          /Button>
        <Heading mb={6} color="blue.500">
          Add a link!
        </Heading><
      Input
  ref = {linkInputRef} variant = "filled"
  mb = {3} type = "url"
  placeholder = "Long URL (max 500 chars)"
  isRequired / > < Input
  ref = {shortRef} variant = "filled"
  mb = {3} type = "url"
  placeholder = "shortened link"
          isReadOnly
        />
        <Button colorScheme="blue" onClick={onCopy} mb={10} ml={64}>
          {hasCopied ? <CheckCircleIcon /> : <CopyIcon />}
        </Button>
        <Button onClick={handleForm} colorScheme="teal" mr={20} mt={-20}>
          Shorten
        </Button>
      </Flex>
    </Flex>
  );
}
