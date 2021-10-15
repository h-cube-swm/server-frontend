import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuestion } from "../../../../contexts/QuestionContext";
import Hider from "../../../Hider/Hider";
import useScrollBlock from "../../../../hooks/useScrollBlock";
import Tooltip from "../../../Tooltip/Tooltip";
import { CardStates, DOMAIN } from "../../../../constants";
import { useMessage } from "../../../../contexts/MessageContext";
import { useGlobalState } from "../../../../contexts/GlobalContext";
import { useModal } from "../../../../contexts/ModalContext";
import setNestedState from "../../../../utils/setNestedState";

import API from "../../../../utils/apis";

/* Assets */
import "./Card.scss";
import imgHandle from "../../../../assets/icons/handle.svg";
import deleteButton from "../../../../assets/icons/del-btn.svg";
import imgAddBtn from "../../../../assets/icons/img-btn.svg";

function Card({ onDelete, onGrab, children }) {
  const { state, surveyId, question, setQuestion, isLast, scrollRef } = useQuestion();
  const { ref, ...others } = useScrollBlock();
  const setQuestionImg = setNestedState(setQuestion, ["img"]);
  const [isLoading, setIsLoading] = useState(false);
  const { publish } = useMessage();
  const { load } = useModal();

  const location = `https://${DOMAIN}${useLocation().pathname}`;
  const href = `https://auth.the-form.io?redirect=${location}`;
  const { token } = useGlobalState();

  const isRoot = location === "https://the-form.io/" || location === "https://dev.the-form.io/";

  const classes = ["survey-card"];

  switch (state) {
    case CardStates.EDITTING:
      classes.push("highlight");
      break;

    case CardStates.PREVIEW:
      classes.push("preview");
      classes.push("hide-handle");
      break;

    case CardStates.RESPONSE:
      classes.push("response");
      classes.push("hide-handle");
      break;

    case CardStates.GHOST:
      classes.push("ghost");
      classes.push("highlight");
      break;

    default:
      break;
  }

  const handleOnGrab = (event) => {
    event.preventDefault();
    if (state !== CardStates.EDITTING) return;
    if (onGrab) onGrab();
  };

  const handleOnDelete = (event) => {
    event.preventDefault();
    if (onDelete) onDelete();
  };

  const getImage = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!token) {
      load(
        <>
          <h2 style={{ fontWeight: "700", marginTop: "2rem" }}>
            🗝 유저만 사용할 수 있는 기능입니다🗝
          </h2>
          <p style={{ fontWeight: "500", marginTop: "2rem" }}>
            1초만에 로그인하고 더 폼 나게 설문을 만들어보세요 👏
          </p>
        </>,
        href,
      );
      setIsLoading(false);
      return;
    }
    const img = e.target.files[0];
    if (!img) {
      setIsLoading(false);
      return;
    }
    if (img.size > 5242880) {
      publish("🤭 사진 용량이 너무 큽니다. 5MB 이하로 용량을 줄여주세요 ✂️", "warning");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("sid", surveyId);
    formData.append("qid", question.id);
    formData.append("file", img);
    try {
      const data = await API.postImg(formData);
      if (data[2] === 400) {
        load(
          <>
            <h2 style={{ fontWeight: "700", marginTop: "2rem" }}>
              🗝 유저만 사용할 수 있는 기능입니다🗝
            </h2>
            <p style={{ fontWeight: "500", marginTop: "2rem" }}>
              1초만에 로그인하고 더 폼 나게 설문을 만들어보세요 👏
            </p>
          </>,
          href,
        );
        setIsLoading(false);
        return;
      }
      setQuestionImg(`${data[0].result}?=${Date.now()}`);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const className = classes.join(" ");
  return (
    <div className={className}>
      <div
        className="content-box"
        ref={(dom) => {
          ref.current = dom;
          scrollRef.current = dom;
        }}
        {...others}>
        {children}
      </div>
      <Hider hide={isLast}>
        {!isRoot && (
          <div className="img-btn-box">
            <label className="img-btn">
              <Tooltip text="이미지는 최대 5MB까지 업로드 가능합니다." size="lg">
                <img src={imgAddBtn} alt="image add button"></img>
              </Tooltip>
              <input type="file" accept="image/*" onChange={getImage}></input>
            </label>
            {isLoading && <p className="loading-indicator">업로드중</p>}
          </div>
        )}
        <button
          className={"delete-btn " + (onDelete ? "" : "hidden")}
          tabIndex={onDelete ? null : "-1"}
          onClick={handleOnDelete}>
          <img src={deleteButton} alt="delete button"></img>
        </button>
        <div className="handle" onMouseDown={handleOnGrab}>
          <img src={imgHandle} alt="handle"></img>
        </div>
      </Hider>
    </div>
  );
}

export default Card;
