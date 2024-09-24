import Navbar from "./navbar";
import { useUser } from "@clerk/nextjs";

export default function NavbarWrapper() {
  const { isSignedIn } = useUser();

  return <Navbar isSignedIn={isSignedIn!} />;
}
