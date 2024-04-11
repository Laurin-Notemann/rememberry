import { Button } from "@frontend/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative">
      <div className="z-10 absolute top-0 left-0 w-full h-full  flex items-center justify-center">
        <div className="z-10 relative flex flex-col items-center justify-center min-h-screenrounded-md  gap-5">
          <h1 className=" text-2xl font-semibold  text-primary">
            Did you not REMEMBERRY your link? 🫣
          </h1>
          <p className="">No worries we got your back 🫐</p>
          <div>
            <Button>
              <Link href="/">Jump back to home screen</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
