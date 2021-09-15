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

let SURVEY_HEIGHT;
let SURVEY_WIDTH;
let SURVEY_DISTANCE;

if (document.getElementById("root").offsetWidth <= 767) {
  SURVEY_HEIGHT = document.getElementById("root").offsetHeight * 0.6;
  SURVEY_WIDTH = 340;
  SURVEY_DISTANCE = 80;
} else {
  SURVEY_HEIGHT = 350;
  SURVEY_WIDTH = 560;
  SURVEY_DISTANCE = 100;
}

export const CardStyle = {
  WIDTH: SURVEY_WIDTH,
  HEIGHT: SURVEY_HEIGHT,
  DISTANCE: SURVEY_DISTANCE,
  FRAME_HEIGHT: SURVEY_HEIGHT + SURVEY_DISTANCE,
  FRAME_WIDTH: SURVEY_WIDTH + SURVEY_DISTANCE,
};

export const IS_DEBUG = window.location.hostname !== "the-form.io";
export const DOMAIN = window.location.hostname;
