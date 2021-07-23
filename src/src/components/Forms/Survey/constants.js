export const CardTypes = {
  SINGLE_CHOICE: 'single-choice',
  MULTIPLE_CHOICE: 'multiple-choice',
  PREFERENCE: 'preference',
  SHORT_SENTENCE: 'short-sentence',
  LONG_SENTENCE: 'long-sentence'
};

export const CardStates = {
  RESPONSE: 'response',
  PREVIEW: 'preview',
  EDITTING: 'editting',
  ORDERING: 'ordering',
  GHOST: 'ghost'
};

const SURVEY_HEIGHT = 400;
const SURVEY_DISTANCE = 100;

export const CardStyle = {
  WIDTH: 640,
  HEIGHT: SURVEY_HEIGHT,
  DISTANCE: SURVEY_DISTANCE,
  FRAME_HEIHGT: SURVEY_HEIGHT + SURVEY_DISTANCE
};