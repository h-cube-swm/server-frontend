/* React elements*/
import React, { useState } from "react";
import { Link } from "react-router-dom";

/* Components */
import Card from "../Card/Card";
import Controller from "../Controller/Controller";
import Sidebar from "../Sidebar/Sidebar";
import { Positioner } from "../../../Positioner/Positioner";
import { QuestionAddButton } from "./QuestionAddButton/QuestionAddButton";

/* HOC, Context, Hooks */
import { SurveyProvider } from "../../../../hooks/_useSurvey";
import withSurvey from "../../../../hocs/withSurvey";
import useScrollPaging from "../../../../hooks/useScrollPaging";
import useDragPaging from "../../../../hooks/useDragPaging";

/* Others */
import orderedMap from "../../../../utils/orderedMap";
import { CardTypes, CardStates, CardStyle } from "../constants";
import "./Edit.scss";

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

	const setQuesionType = (type) => {
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
			if (newIndex < 0) return index;
			if (newIndex >= survey.questions.length) return index;
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
						<Controller type={selectedSurveyType} setType={setQuesionType} />
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
				<div className="question-box" onWheel={onWheel}>
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

						const yPos = (index - selectedIndex) * CardStyle.FRAME_HEIHGT;

						return (
							<Positioner key={question.id} y={yPos}>
								<Card
									question={question}
									setQuestion={getSetQuestion(index)}
									state={state}
									onDelete={() => {
										removeQuestion(index);
									}}
									onGrab={onGrab}
									slowAppear={questions.length > 1}
								/>
							</Positioner>
						);
					})}

					<Card
						question={questions[selectedIndex]}
						state={CardStates.GHOST}
						hidden={!isDragging}
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
		<SurveyProvider value={[survey, setSurvey]}>
			<div className="edit" {...backgroundCallbacks}>
				{contents}
			</div>
		</SurveyProvider>
	);
};

export default withSurvey(Edit);
