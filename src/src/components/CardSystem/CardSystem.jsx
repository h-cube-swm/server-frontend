import React, { useState } from "react";
import { CardStyle } from "../Forms/Survey/constants";
import { Positioner } from "../Positioner/Positioner";
import "./CardSystem.scss";
import handleImage from "../../assets/icons/handle.svg";
import useDragPaging from "../../hooks/useDragPaging";

function Card({ children, onGrab, handle }) {
	return (
		<div
			className="card-system-card"
			style={{
				width: CardStyle.WIDTH,
				height: CardStyle.HEIGHT,
			}}>
			{children}
			<Hider hide={!handle}>
				<div className="card-system-handle" onMouseDown={onGrab}>
					<img src={handleImage} alt="Handle"></img>
				</div>
			</Hider>
		</div>
	);
}

function CardSystem({ items, setItems }) {
	const [selected, setSelected] = useState(0);
	const [onGrab, backgroundCallbacks, ref, isDragging] = useDragPaging(
		(delta) => {
			setSelected((index) => {
				let newIndex = index + delta;
				if (newIndex < 0) return index;
				if (newIndex >= items.length) return index;
				return newIndex;
			});
		}
	);

	const [onWheel, isMoving] = useScrollPaging((delta) => {
		setSelected((index) => {
			let newIndex = index + delta;
			if (newIndex < 0) return index;
			if (newIndex >= items.length) return index;
			return newIndex;
		});
	});

	// Build key-item dict
	const itemDict = {};

	if (items) {
		items.forEach((item, index) => {
			// Check if an item has key prop
			if (!("key" in item)) {
				console.error(item);
				throw new Error(
					"Every item in items must has unique key prop. Item above does not have one."
				);
			}

			const { key } = item;

			// Check if key is string
			if (typeof key !== "string") {
				console.error(item);
				throw new Error("Key must be a string. Given key is not a string.");
			}

			// Check if key is duplicated
			if (key in itemDict) {
				console.error(item);
				throw new Error(
					"Every item in items must has unique key prop. Item above has duplicated key."
				);
			}

			itemDict[key] = [item, index];
		});
	}

	const sortedKeys = Object.keys(itemDict).sort();

	return (
		<div className="card-system" {...backgroundCallbacks} onWheel={onWheel}>
			{sortedKeys
				.map((key) => itemDict[key])
				.map(([item, index]) => {
					const y = (index - selected) * CardStyle.FRAME_HEIHGT;
					return (
						<Positioner y={y} ref={ref}>
							<Card onGrab={onGrab}>{item}</Card>
						</Positioner>
					);
				})}
		</div>
	);
}

export default CardSystem;
