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

const Edit = ({ match }) => {
	const [survey, setSurvey] = useState({ questions: [] });
	const [selectedIndex, setSelectedIndex] = useState(0);

	const surveyId = match.params.link;

	const [onWheel, isMoving] = useScrollPaging((delta) => {
		setSelectedIndex((index) => {
			let newIndex = index + delta;
			if (newIndex < 0) newIndex = 0;
			if (newIndex >= questions.length) newIndex = questions.length - 1;
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
			setSurvey({
				...survey,
				questions,
			});
		}
	);

	const { questions } = survey;

	useEffect(() => {
		const init = async () => {
			const { result: survey } = await getApi(`/surveys/${surveyId}`);
			if (!survey.counter) survey.counter = 0;
			if (!survey.questions) survey.questions = [];
			setSurvey(survey);
			if (survey.questions.length == 0) insertQuestion(0);
		};
		init();
	}, [surveyId]);

	const setSelectedSurveyType = (type) => {
		setSurvey((survey) => {
			const questions = [...survey.questions];
			questions[selectedIndex].type = type;
			return {
				questions,
				...survey,
			};
		});
	};

	/**
	 * Insert new survey at given index.
	 * @param {Integer} index
	 */
	const insertQuestion = (index) => {
		setSurvey((survey) => {
			const counter = survey.counter + 1;
			const newQuestion = {
				id: counter + "",
				type: CardTypes.SINGLE_CHOICE,
			};
			const questions = [...survey.questions];
			questions.splice(index, 0, newQuestion);
			return { ...survey, counter, questions };
		});
		if (survey.questions.length === 0) setSelectedIndex(0);
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

	const selectedSurveyType = survey.questions[selectedIndex]?.type;
	const showAddButton = !isDragging && !isMoving;

	return (
		<div className="edit" {...backgroundCallbacks}>
			<div className="positioning-box">
				<div className="controller-box">
					<Controller
						element={selectedSurveyType}
						setElement={setSelectedSurveyType}
					/>
					<Link
						className="link-btn"
						to={"/forms/survey/end/" + match.params.link}>
						완료
					</Link>
				</div>
				<div className="sidebar-box">
					<Sidebar
						questions={questions}
						currentIndex={selectedIndex}
						onSelect={setSelectedIndex}></Sidebar>
				</div>
			</div>
			<div className="question-container" onWheel={onWheel}>
				{orderedMap(questions, (question, index) => {
					const isSelected = index === selectedIndex;

					let state = CardStates.RESPONSE;
					if (isSelected) {
						if (isDragging) {
							state = CardStates.ORDERING;
						} else {
							state = CardStates.EDITTING;
						}
					}

					return (
						<Card
							key={question.id}
							question={question}
							index={index}
							selectedIndex={selectedIndex}
							state={state}
							onDelete={() => {
								removeQuestion(index);
							}}
							onGrab={onGrab}
							slowAppear={questions.length > 1}></Card>
					);
				})}
				<Card
					question={questions[selectedIndex]}
					state={CardStates.GHOST}
					index={isDragging ? 1 : 0}
					dom={item}></Card>
				<div
					className="question-add-box"
					style={{
						transform: `translate(-50%,-50%) translateY(${
							-(CardStyle.HEIGHT + CardStyle.DISTANCE) / 2
						}px)`,
						opacity: showAddButton ? null : 0,
					}}>
					<button onClick={() => insertQuestion(selectedIndex)}>
						<img src={addBtn} alt="add button" />
					</button>
				</div>
				<div
					className="question-add-box"
					style={{
						transform: `translate(-50%,-50%) translateY(${
							+(CardStyle.HEIGHT + CardStyle.DISTANCE) / 2
						}px)`,
						opacity: showAddButton ? null : 0,
					}}
					hidden={!showAddButton}>
					<button onClick={() => insertQuestion(selectedIndex + 1)}>
						<img src={addBtn} alt="add button" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Edit;
