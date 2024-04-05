import { Button } from "@frontend/components/ui/button";
import { Maximize2 } from "lucide-react";

export const OpenModalButton = () => {
  const openCard = () => {};

  return (
    <div>
      <Button variant="secondary" size="icon" className="ml-4">
        <Maximize2 />
      </Button>
    </div>
  );
};
