import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@frontend/components/ui/select";
import { useDropDownFocusStore } from "../../lib/services/stores/headerDropdownStore";

export const DifficultyPicker = () => {
  const title = useDropDownFocusStore((state) => state.dropdownName);
  const updateTitle = useDropDownFocusStore((state) => state.updateDropDown);

  return (
    <Select>
      <SelectTrigger className="[w-auto]  dark:bg-dark-800  hover:dark:bg-dark-600 hover:bg-gray-50">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent className="flex flex-col  dark:bg-dark-800  ">
        <SelectGroup className="">
          <SelectLabel>How do you want to see the difficulty?</SelectLabel>
          <SelectItem
            onClick={() => updateTitle("Colored Borders")}
            className=""
            value="borders"
          >
            Colored borders
          </SelectItem>
          <SelectItem
            onClick={() => updateTitle("Colored flashcards")}
            className=""
            value="flashcards"
          >
            Colored flashcards
          </SelectItem>
          <SelectItem onClick={() => updateTitle("No color ")} value="No">
            Not at all
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
