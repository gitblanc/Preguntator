import React, { useState, useEffect } from "react";
import { desordenarPreguntasRespuestas } from "../functions/fileFunctions";
import styles from "./FileUploader.module.css";
import alligator from "../images/alligator.gif";

const FileUploader = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [preguntasRespuestasDesordenadas, setPreguntasRespuestasDesordenadas] =
		useState([]);
	const [showAnswers, setShowAnswers] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
	const [respuestasInCorrectas, setRespuestasInCorrectas] = useState(0);
	const [maxPreguntas, setMaxPreguntas] = useState("todas");

	useEffect(() => {
		if (showAnswers) {
			let correctAnswers = 0;
			let incorrectAnswers = 0;

			preguntasRespuestasDesordenadas.forEach((pregunta, preguntaIndex) => {
				pregunta.respuestas.forEach((respuesta, respuestaIndex) => {
					const answerKey = `${preguntaIndex}-${respuestaIndex}`;

					if (
						respuesta.esRespuestaCorrecta &&
						selectedAnswers.includes(answerKey)
					) {
						correctAnswers++;
					} else if (
						!respuesta.esRespuestaCorrecta &&
						selectedAnswers.includes(answerKey)
					) {
						incorrectAnswers++;
					}
				});
			});

			setRespuestasCorrectas(correctAnswers);
			setRespuestasInCorrectas(incorrectAnswers);
		}
	}, [showAnswers]);

	const handleFileChange = (event) => {
		const file = event.target.files[0];

		if (file && file.type === "text/plain") {
			setSelectedFile(file);
		} else {
			console.log("Solo se permiten archivos de texto (.txt)");
			setSelectedFile(null);
		}
	};

	const handleFileUpload = () => {
		if (!selectedFile) {
			console.log("No se ha seleccionado ningún archivo.");
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const fileContent = event.target.result;

			const preguntasRespuestasDesordenadas =
				desordenarPreguntasRespuestas(fileContent);

			let preguntasFiltradas = preguntasRespuestasDesordenadas;

			if (
				maxPreguntas !== "" &&
				!isNaN(maxPreguntas) &&
				Number(maxPreguntas) > 0
			) {
				const numeroMaximoPreguntas = Math.min(
					Number(maxPreguntas),
					preguntasRespuestasDesordenadas.length
				);

				preguntasFiltradas = preguntasRespuestasDesordenadas.slice(
					0,
					numeroMaximoPreguntas
				);
			}

			setPreguntasRespuestasDesordenadas(preguntasFiltradas);
		};

		reader.readAsText(selectedFile);
	};

	const handleAnswerClick = (preguntaIndex, respuestaIndex) => {
		const answerKey = `${preguntaIndex}-${respuestaIndex}`;

		if (selectedAnswers.includes(answerKey)) {
			setSelectedAnswers((prevSelectedAnswers) =>
				prevSelectedAnswers.filter((answer) => answer !== answerKey)
			);
		} else {
			setSelectedAnswers((prevSelectedAnswers) => [
				...prevSelectedAnswers,
				answerKey,
			]);
		}
	};

	const renderRespuestas = () => {
		return preguntasRespuestasDesordenadas.map((item, index) => {
			const { pregunta, respuestas } = item;

			return (
				<div key={index}>
					<p>
						{index + 1}. {pregunta}
					</p>
					{respuestas.map((respuesta, i) => {
						const respuestaClassName = showAnswers
							? respuesta.esRespuestaCorrecta
								? `${styles.respuesta} ${styles.respuestaCorrecta}`
								: `${styles.respuesta} ${styles.respuestaIncorrecta}`
							: `${styles.respuesta} ${styles.respuestaNormal}`;

						const isSelected = selectedAnswers.includes(`${index}-${i}`);
						const isCorrect = respuesta.esRespuestaCorrecta;

						const buttonStyle = {
							display: "block",
							background: showAnswers
								? isCorrect
									? "rgba(28, 130, 28, 32)"
									: "transparent"
								: isSelected
								? "rgba(194, 126, 41, 32)"
								: "transparent",
							color: "#FFFFFF",
							border: "1px groove #ffffff",
							padding: "5px",
							margin: "5px",
							borderRadius: "3px",
						};

						return (
							<button
								key={i}
								className={respuestaClassName}
								style={buttonStyle}
								onClick={() => handleAnswerClick(index, i)}
							>
								{respuesta.respuestaIndex}. {respuesta.respuesta}
								{showAnswers &&
									isSelected &&
									(isCorrect ? (
										<span style={{ marginLeft: "5px", color: "#4CAF50" }}>
											✔️
										</span> // correcta: ✔️
									) : (
										<span style={{ marginLeft: "5px", color: "#FF0000" }}>
											❌
										</span> // incorrecta: ❌
									))}
							</button>
						);
					})}
				</div>
			);
		});
	};

	const toggleShowAnswers = () => {
		setRespuestasCorrectas(0);
		setRespuestasInCorrectas(0);
		setShowAnswers(!showAnswers);
	};

	return (
		<div className={`${styles.container} container`}>
			<div>
				<input
					id="fileInput"
					type="file"
					accept=".txt"
					placeholder="Sube tus preguntas"
					onChange={handleFileChange}
					className={styles.customInput}
				/>
				<input
					type="text"
					value={maxPreguntas}
					onChange={(event) => setMaxPreguntas(event.target.value)}
					placeholder="Número de preguntas"
					className={styles.inputText}
				/>
				<button onClick={handleFileUpload}>¡Desordenar!</button>
			</div>
			<div className="text-container">
				<h2>Preguntas y respuestas desordenadas:</h2>
				{preguntasRespuestasDesordenadas.length < 1 && (
					<img src={alligator} alt="Animated GIF" width="70%" height="70%" />
				)}
				{preguntasRespuestasDesordenadas.length > 0 && (
					<>
						{renderRespuestas()}
						{showAnswers ? (
							<button onClick={toggleShowAnswers}>Ocultar respuestas</button>
						) : (
							<button onClick={toggleShowAnswers}>Mostrar respuestas</button>
						)}
						<div>
							<h3>
								Aciertos: {respuestasCorrectas}/
								{preguntasRespuestasDesordenadas.length}
							</h3>
							<h3>
								Fallos: {respuestasInCorrectas}/
								{preguntasRespuestasDesordenadas.length}
							</h3>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default FileUploader;
