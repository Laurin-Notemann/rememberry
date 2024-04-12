import { Button } from "@frontend/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex w-screen h-screen justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-2xl font-semibold text-primary">
          Did you not rememberry your link?
        </h1>
        <p>No worries we got your back</p>
        <div>
          <Button>
            <Link href="/">Jump back to home screen</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
