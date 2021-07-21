import { CardTypes } from "./constants";

export default function getQuestion(counter) {
  return [counter + 1, {
    id: counter + "",
    type: CardTypes.SINGLE_CHOICE,
    isRequired: true,
  }];
}