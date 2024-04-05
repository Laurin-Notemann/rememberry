// root page
import { Button } from "@frontend/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * tailwind uses tree-shaking to optimize which classnames actually get injected in the css.
 * but we have some classes that we generate dynamically, which tailwind doesn't register.
 * to have them show up anyway, we inject them here.
 * ideally, we would use the `safelist` option in the tailwind config, but that doesn't seem to work.
 *
 * @see https://stackoverflow.com/questions/73660771/tailwind-safelist-patterns-for-multiple-patterns
 *
 */
function TailwindClassPreloader() {
  return (
    <div className="bg-red-500 bg-green-500 bg-orange-500 bg-yellow-500 border-red-500 border-green-500 border-orange-500 border-yellow-500 hidden" />
  );
}

export default function Home() {
  return (
    <main className="bg-white">
      <TailwindClassPreloader />
      <div className="flex flex-col space-y-8 justify-center items-center h-screen">
        <h1 className="text-3xl font-medium max-w-xl">
          Welcome @rememberry 🫐
        </h1>
        <Link href={"/login"}>
          <Button className="flex items-center">
            <span>Go to the Login page</span>
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
