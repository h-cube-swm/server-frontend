/* React elements*/
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* Test */
import { getApi } from "../../../../utils/parser";
import { CardTypes, CardStates, CardStyle } from "../constants";
import "./Edit.scss";

/* Components */
import Card from "../Card/Card";
import Controller from "../Controller/Controller";
import useScrollPaging from "../../../../hooks/useScrollPaging";
import useDragPaging from "../../../../hooks/useDragPaging";
import addBtn from "../../../../assets/icons/add-btn.svg";
import Sidebar from "../Sidebar/Sidebar";
import orderedMap from "../../../../utils/orderedMap";
import { SurveyProvider } from "../../../../hooks/_useSurvey";
import { Positioner } from "../../../Positioner/Positioner";
import withSurvey from "../../../../hocs/withSurvey";

function QuestionAddButton({ show, y, onClick }) {
	return (
		<Positioner y={y}>
			<div className="question-add-box" style={{ opacity: show ? null : 0 }}>
				<button onClick={onClick}>
					<img src={addBtn} alt="add button" />
				</button>
			</div>
		</Positioner>
	);
}

const Edit = ({ surveyId, survey, setSurvey }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const getSetQuestion = (index) => (question) => {
		setSurvey((survey) => {
			const questions = [...survey.questions];
			if (typeof question === "function") {
				questions[index] = question(questions[index]);
			} else {
				questions[index] = question;
			}
			return { ...survey, questions };
		});
	};

	const setSelectedSurveyType = (type) => {
		const setQuestion = getSetQuestion(selectedIndex);
		setQuestion((question) => ({ ...question, type }));
	};

	const insertQuestion = (index) => {
		setSurvey((survey) => {
			const counter = survey.counter + 1;
			const newQuestion = {
				id: counter + "",
				type: CardTypes.SINGLE_CHOICE,
				isRequired: true,
			};
			const questions = [...survey.questions];
			questions.splice(index, 0, newQuestion);
			return { ...survey, counter, questions };
		});
		if (survey && survey.questions.length === 0) setSelectedIndex(0);
		else setSelectedIndex(index);
	};

	const removeQuestion = (index) => {
		setSurvey((survey) => {
			const questions = [...survey.questions];
			questions.splice(index, 1);
			return { ...survey, questions };
		});
		if (index === survey.questions.length - 1) {
			setSelectedIndex(index - 1);
		}
	};

	const [onWheel, isMoving] = useScrollPaging((delta) => {
		setSelectedIndex((index) => {
			let newIndex = index + delta;
			if (newIndex < 0) return;
			if (newIndex >= survey.questions.length) return;
			return newIndex;
		});
	});

	const [onGrab, backgroundCallbacks, item, isDragging] = useDragPaging(
		(delta) => {
			let newIndex = selectedIndex + delta;
			if (newIndex < 0) return;
			if (newIndex >= survey.questions.length) return;
			if (newIndex === selectedIndex) return;

			const questions = [...survey.questions];
			const tmp = questions[selectedIndex];
			questions[selectedIndex] = questions[newIndex];
			questions[newIndex] = tmp;

			setSelectedIndex(newIndex);
			setSurvey({ ...survey, questions });
		}
	);

	let contents = null;
	if (survey) {
		const selectedSurveyType = survey.questions[selectedIndex]?.type;
		const showAddButton = !isDragging && !isMoving;
		const { questions } = survey;

		contents = (
			<>
				<div className="positioning-box">
					<div className="controller-box">
						<Controller
							element={selectedSurveyType}
							setElement={setSelectedSurveyType}
						/>
						<Link className="link-btn" to={"/forms/survey/end/" + surveyId}>
							완료
						</Link>
					</div>
					<div className="sidebar-box">
						<Sidebar
							questions={questions}
							currentIndex={selectedIndex}
							onSelect={setSelectedIndex}
						/>
					</div>
				</div>
				<div className="question-container" onWheel={onWheel}>
					{orderedMap(questions, (question, index) => {
						const isSelected = index === selectedIndex;

						let state = null;
						if (isSelected) {
							if (isDragging) {
								state = CardStates.ORDERING;
							} else {
								state = CardStates.EDITTING;
							}
						} else {
							state = CardStates.PREVIEW;
						}

						return (
							<Card
								key={question.id}
								question={question}
								setQuestion={getSetQuestion(index)}
								index={index}
								selectedIndex={selectedIndex}
								state={state}
								onDelete={() => {
									removeQuestion(index);
								}}
								onGrab={onGrab}
								slowAppear={questions.length > 1}
							/>
						);
					})}
					<Card
						question={questions[selectedIndex]}
						state={CardStates.GHOST}
						index={isDragging ? 1 : 0}
						dom={item}></Card>
					<QuestionAddButton
						onClick={() => insertQuestion(selectedIndex)}
						y={-CardStyle.FRAME_HEIHGT / 2}
						show={showAddButton}
					/>
					<QuestionAddButton
						onClick={() => insertQuestion(selectedIndex + 1)}
						y={+CardStyle.FRAME_HEIHGT / 2}
						show={showAddButton}
					/>
				</div>
			</>
		);
	} else {
		<div className="loading-screen">Now Loading...</div>;
	}
	return (
		<SurveyProvider data={[survey, setSurvey]}>
			<div className="edit" {...backgroundCallbacks}>
				{contents}
			</div>
		</SurveyProvider>
	);
};

export default withSurvey(Edit);
