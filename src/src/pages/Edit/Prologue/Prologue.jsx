import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import setNestedState from "utils/setNestedState";
import { useModal } from "contexts/ModalContext";
import { useGlobalState } from "contexts/GlobalContext";
import { DOMAIN } from "constants.js";

/* Components */
import TextField from "components/TextField/TextField";
import ExpandableInput from "components/ExpandableInput/ExpandableInput";

/* Styles */
import "./Prologue.scss";
import logo from "assets/images/logo.png";
import delBtn from "assets/icons/del-btn1.svg";
import { useMessage } from "contexts/MessageContext";

function shadeHexColor(color, percent) {
  let tempColor = color;
  if (!color) tempColor = "#2b44ff";
  const num = tempColor.slice(1);
  const f = parseInt(num, 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = f >> 16; // eslint-disable-line no-bitwise
  const G = (f >> 8) & 0x00ff; // eslint-disable-line no-bitwise
  const B = f & 0x0000ff; // eslint-disable-line no-bitwise
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

export default function Prologue({ survey, setSurvey, isFolded, setIsFolded, children }) {
  const [isClosed, setIsClosed] = useState(true);
  const titleTextArea = useRef(null);
  const firstUpdate = useRef(true);
  const { load } = useModal();
  const location = `https://${DOMAIN}${useLocation().pathname}`;
  const href = `https://auth.the-form.io?redirect=${location}`;
  const { publish } = useMessage();
  const { token } = useGlobalState();
  const { themeColor } = survey;
  const [drawNumber, setDrawNumber] = useState(survey?.draw?.number);
  const setSurveyThemeColor = setNestedState(setSurvey, ["themeColor"]);
  const setSurveyDraw = setNestedState(setSurvey, ["draw"]);
  const colorBoxClasses = ["color-picker-box"];

  useEffect(() => {
    if (!survey.title) {
      titleTextArea.current.focus();
    }
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (Number.isNaN(+drawNumber)) {
      publish("???????????? ?????? ??????????????? ???? ????????? ?????????????????? ????", "warning");
      setDrawNumber(null);
      return;
    }
    const newDraw = { isEnabled: survey.draw.isEnabled, number: +drawNumber };
    setSurveyDraw(newDraw);
  }, [drawNumber]);

  const bgColor = survey.draw.isEnabled
    ? `${shadeHexColor(themeColor, 0.4)}`
    : `${shadeHexColor(themeColor, 0.85)}`;

  const onClick = () => {
    setIsFolded(true);
  };

  const onOpen = () => {
    if (!token) {
      load({
        children: (
          <>
            <h2 style={{ fontWeight: "700" }}>???? ????????? ????????? ??? ?????? ???????????????????</h2>
            <p style={{ fontWeight: "500", marginTop: "2rem", marginBottom: "2rem" }}>
              1????????? ??????????????? ??? ??? ?????? ????????? ?????????????????? ????
            </p>
          </>
        ),
        href,
      });
      return;
    }
    setIsClosed(false);
  };

  const onClosed = () => {
    setIsClosed(true);
  };

  const onDraw = () => {
    if (!token) {
      load({
        children: (
          <>
            <h2 style={{ fontWeight: "700" }}>???? ????????? ????????? ??? ?????? ???????????????????</h2>
            <p style={{ fontWeight: "500", marginTop: "2rem", marginBottom: "2rem" }}>
              1????????? ??????????????? ??? ??? ?????? ????????? ?????????????????? ????
            </p>
          </>
        ),
        href,
      });
      return;
    }
    const newDraw = { isEnabled: !survey.draw.isEnabled, number: survey.draw.number };
    setSurveyDraw(newDraw);
  };

  const classes = ["prologue-box"];
  if (isFolded) classes.push("folded");
  else classes.push("extended");
  if (isClosed) colorBoxClasses.push("closed");
  const className = classes.join(" ");

  return (
    <div className={className}>
      <div className={!isFolded ? "survey-header" : "survey-header folded"}>
        {isFolded && (
          <div className="logo">
            <Link to="/" target="_blank">
              <img src={logo} alt="logo" />
            </Link>
          </div>
        )}
        <div className={!isFolded ? "info" : "info folded"}>
          <div className={!isFolded ? "title-box" : "title-box folded"}>
            <h1
              className={!isFolded && !survey.title ? "title-intro" : "title-intro disabled"}
              style={{ color: themeColor }}>
              ???????????? ??????
            </h1>
            {isFolded ? (
              <TextField
                tabIndex="1"
                text={survey.title}
                setText={setNestedState(setSurvey, ["title"])}
                placeholder="??? ??? ?????? ????????? ??????????????????"
                size="title"
                ref={titleTextArea}
                onFocus={() => setIsFolded(false)}
              />
            ) : (
              <ExpandableInput
                tabIndex="1"
                text={survey.title}
                setText={setNestedState(setSurvey, ["title"])}
                placeholder="??? ??? ?????? ????????? ??????????????????"
                type="lg"
                ref={titleTextArea}
                center={true}
                onFocus={() => setIsFolded(false)}
              />
            )}
          </div>
          <div className={!survey.description ? "description-box" : "description-box full"}>
            <h3
              className={
                !isFolded && !survey.description
                  ? "description-intro"
                  : "description-intro disabled"
              }
              style={{ color: themeColor }}>
              ????????? ???????????? ????????? ??????????????????.
            </h3>
            <ExpandableInput
              tabIndex="2"
              text={survey.description}
              setText={setNestedState(setSurvey, ["description"])}
              placeholder="??? ??? ?????? ????????? ????????? ???????????????"
              type="description"
              center={true}
              onFocus={() => setIsFolded(false)}
            />
          </div>
          <div className={!isFolded ? "color-box" : "color-box disabled"}>
            <h3 className="color-intro" style={{ color: themeColor }}>
              ???????????? ????????? ??????????????????
            </h3>
            <div className="hex-box">
              <button
                className="color-indicator"
                style={{ backgroundColor: themeColor }}
                onClick={onOpen}
              />
              <TextField
                tabIndex="2"
                text={themeColor}
                setText={setSurveyThemeColor}
                placeholder="hex?????? ??????????????? ??????????????????."
                size="rg"
                onFocus={() => setIsFolded(false)}
              />
            </div>

            <div className={colorBoxClasses.join(" ")}>
              <HexColorPicker color={survey.themeColor} onChange={setSurveyThemeColor} />
              <button className="close-btn" onClick={onClosed}>
                <img src={delBtn} alt="close picker box" />
              </button>
            </div>
            <div className="draw-box">
              <button
                className={survey.draw.isEnabled ? "draw-btn selected" : "draw-btn"}
                onClick={onDraw}
                style={{
                  backgroundColor: bgColor,
                  color: `${themeColor}`,
                  border: `1.5px solid ${themeColor}`,
                }}>
                {survey.draw.isEnabled ? (
                  <>??? ?????? ?????????????????????????</>
                ) : (
                  <>????????? ?????????????????????????</>
                )}
              </button>
              {survey.draw.isEnabled && (
                <>
                  <ExpandableInput
                    tabIndex="2"
                    text={drawNumber}
                    setText={setDrawNumber}
                    placeholder="0"
                    type="title number"
                    center={true}
                    onFocus={() => setIsFolded(false)}
                  />
                  <h3>???</h3>
                </>
              )}
            </div>
            <p className="draw-description">
              * ????????????? ?????? ?????? ?????? ???????????? ???????????? ?????? ????????????.
            </p>
          </div>
        </div>
        {isFolded && <div className="children-box">{children}</div>}
      </div>
      <div className="fold-button-box">
        <button className="fold-btn" onClick={onClick} style={{ backgroundColor: themeColor }}>
          ??????
        </button>
      </div>
    </div>
  );
}
