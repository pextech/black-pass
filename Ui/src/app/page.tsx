import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";

export default function Home() {
  const isLogin = false;

  return (
    <main className="h-screen">
      {isLogin ? <LandingPageCard /> : <CreateAccountCard />}
    </main>
  );
}
