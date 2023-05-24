import React, { useState } from "react";
import { desordenarPreguntasRespuestas } from "../functions/fileFunctions";
import styles from "./FileUploader.module.css";

const FileUploader = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [preguntasRespuestasDesordenadas, setPreguntasRespuestasDesordenadas] =
		useState([]);
	const [showAnswers, setShowAnswers] = useState(false);

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

			console.log(preguntasRespuestasDesordenadas);
			setPreguntasRespuestasDesordenadas(preguntasRespuestasDesordenadas);
		};
		reader.readAsText(selectedFile);
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
								? styles.verdadera
								: styles.respuestaNormal
							: styles.respuestaNormal;
						return (
							<p
								key={i}
								className={`${styles.respuesta} ${respuestaClassName}`}
							>
								&nbsp;&nbsp;&nbsp;&nbsp;{respuesta.respuestaIndex}.{" "}
								{respuesta.respuesta}
							</p>
						);
					})}
				</div>
			);
		});
	};

	const toggleShowAnswers = () => {
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
				<button onClick={handleFileUpload}>¡Desordenar!</button>
			</div>
			<div className="text-container">
				<h2>Preguntas y respuestas desordenadas:</h2>
				{preguntasRespuestasDesordenadas.length > 0 && (
					<>
						{renderRespuestas()}
						<button onClick={toggleShowAnswers}>
							{showAnswers ? "Ocultar respuestas" : "Mostrar respuestas"}
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default FileUploader;
