import { FC } from "react";

type RatingTrafficLightsProps = {
  onColorChange?: (color: ColorType) => void;
};

export const TrafficColor = {
  green: "green-500",
  yellow: "yellow-500",
  orange: "orange-500",
  red: "red-500",
} as const;

export type ColorType = keyof typeof TrafficColor;

export const RatingTrafficLights: FC<RatingTrafficLightsProps> = ({
  onColorChange,
}) => {
  const changeBorder = (color: ColorType) => {
    onColorChange?.(color);
  };

  return (
    <div className="rounded-lg flex flex-col justify-center gap-2">
      {Object.keys(TrafficColor).map((colorClass, index) => {
        const backgroundStyle = "bg-" + TrafficColor[colorClass as ColorType];

        return (
          <button
            key={index}
            onClick={() => changeBorder(colorClass as ColorType)}
            className={`w-5 h-5 rounded-full ${backgroundStyle}`}
          ></button>
        );
      })}
    </div>
  );
};
