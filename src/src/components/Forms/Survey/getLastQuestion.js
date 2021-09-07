import { CardTypes } from "../../../constants";

export default function getLastQuestion(counter) {
  return [
    counter + 1,
    {
      id: counter + "",
      title: "감사합니다.",
      type: CardTypes.EMPTY,
      isRequired: false,
    },
  ];
}
