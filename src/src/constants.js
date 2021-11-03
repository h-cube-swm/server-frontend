export const CardTypes = {
  SINGLE_CHOICE: "single-choice",
  MULTIPLE_CHOICE: "multiple-choice",
  PREFERENCE: "preference",
  SHORT_SENTENCE: "short-sentence",
  LONG_SENTENCE: "long-sentence",
  EMPTY: "empty",
};

export const CardStates = {
  RESPONSE: "response",
  PREVIEW: "preview",
  EDITTING: "editting",
  ORDERING: "ordering",
  GHOST: "ghost",
};

export const SurveyStatus = {
  EDITING: "editing",
  PUBLISHED: "published",
  FINISHED: "finished",
  DELETED: "deleted",
};

let SURVEY_DISTANCE;

if (document.getElementById("root").offsetWidth <= 767) {
  SURVEY_DISTANCE = 80;
} else {
  SURVEY_DISTANCE = 150;
}

export const CardStyle = {
  DISTANCE: SURVEY_DISTANCE,
  FRAME_HEIGHT: 1000,
};

export const IS_DEBUG = window.location.hostname !== "the-form.io";
export const DOMAIN = window.location.hostname;
