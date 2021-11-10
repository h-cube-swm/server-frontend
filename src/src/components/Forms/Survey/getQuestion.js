import { v4 } from "uuid";
import { CardTypes } from "../../../constants";

export default function getQuestion() {
  const id = v4();
  return {
    id,
    type: CardTypes.SINGLE_CHOICE,
    isRequired: true,
    choices: [""],
  };
}
