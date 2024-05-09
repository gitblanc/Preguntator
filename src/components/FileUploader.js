import React, { useState, useEffect } from "react";
import { desordenarPreguntasRespuestas } from "../functions/fileFunctions";
import styles from "./FileUploader.module.css";
import alligator from "../images/alligator.gif";

const FileUploader = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedFileImages, setSelectedFileImages] = useState(null);
	const [preguntasRespuestasDesordenadas, setPreguntasRespuestasDesordenadas] =
		useState([]);
	const [showAnswers, setShowAnswers] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
	const [respuestasInCorrectas, setRespuestasInCorrectas] = useState(0);
	const [maxPreguntas, setMaxPreguntas] = useState("todas");
	const [images, setImages] = useState({});

	const imagesDic = {};

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

	const handleImageChage = (event) => {
		const files = event.target.files;

    	if (files && files.length > 0) {
			const allImagesValid = Array.from(files).every((file) => file.type.startsWith("image/"));

			if (allImagesValid) {
				setSelectedFileImages(files);
				return;
			}
		}

		console.log("Solo se permiten subir archivos de imagen.");
		setSelectedFileImages(null);
	}

	const handleFileUpload = () => {
		if (!selectedFile) {
			console.log("No se ha seleccionado ningún archivo.");
			return;
		}

		if (selectedFileImages && selectedFileImages.length > 0) {
			// wait images load
			handleFileImagesUpload(() => {
				play();
			});

			return;
		}

		play();
	};

	const play = () => {
		setSelectedAnswers([]);
		setShowAnswers(false);

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

			setImages(imagesDic);
		};

		reader.readAsText(selectedFile);
	}

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

	const handleFileImagesUpload = (callback) => {
		let counter = 0; 
	  
		const handleImageLoad = async (image, blob) => {
			imagesDic[image.name] = blob;
			counter++;
		
			if (counter === selectedFileImages.length) {
				await callback();
			}
		};
	  
		// Iterar sobre cada imagen seleccionada
		Array.from(selectedFileImages).forEach((image) => {
			const reader = new FileReader();
		
			// Configurar la función de manejo de carga del lector
			reader.onload = (e) => {
				const dataUrl = e.target.result;
				const blob = dataURLToBlob(dataUrl);
		
				// Llamar a la función de manejo de carga de imagen
				handleImageLoad(image, blob);
			};
		
			// Leer el contenido de la imagen como URL de datos
			reader.readAsDataURL(image);
		});
	};
	  

	const dataURLToBlob = (dataUrl) => {
		const parts = dataUrl.split(';base64,');
		const contentType = parts[0].split(':')[1];
		const raw = window.atob(parts[1]);
		const rawLength = raw.length;
		const uInt8Array = new Uint8Array(rawLength);

		for (let i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}

		return new Blob([uInt8Array], { type: contentType });
	}

	const renderRespuestas = () => {
		return preguntasRespuestasDesordenadas.map((item, index) => {
			const { pregunta, respuestas, image } = item;

			return (
				<div key={index}>
					<p>
						{index + 1}. {pregunta}
					</p>
					{ image ? renderImage(image) : "" }
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

	const renderImage = (image) => {
		if (images[image]) {
			if (images[image].size > 40000)
				return (<img className="mb-2" width={ "500px" } src={ URL.createObjectURL(images[image]) } alt="image about question" /> );

			return (
				<div className="d-flex flex-column">
					<span className="text-warning mb-2">La imagen '{ image }' es demasiado pequeña. Se recomienda un tamaño mínimo de 500 píxeles de ancho.</span>
					<img className="mb-2" width={ "500px" } src={ URL.createObjectURL(images[image]) } alt="image about question" />
				</div>
			);
		}

		return (<span className="text-danger">Parece que no has subido la imagen: { image }</span>);
	}

	const toggleShowAnswers = () => {
		setRespuestasCorrectas(0);
		setRespuestasInCorrectas(0);
		setShowAnswers(!showAnswers);
	};

	return (
		<div className={`${styles.container} container`}>
			<div className="row">
				<div className="col">
					<div className="d-flex flex-column">
						<span>Preguntas:</span>
						<input
							id="fileInput"
							type="file"
							accept=".txt"
							placeholder="Sube tus preguntas"
							onChange={handleFileChange}
							className={styles.customInput}
						/>
					</div>
				</div>
				<div className="col">
					<div className="d-flex flex-column">
						<span>Imágenes asociadas a las preguntas:</span>
						<input
							type="file"
							id="imgInput"
							accept="image/*"
							placeholder="Sube las imágenes asociadas a las preguntas"
							onChange={ handleImageChage }
							className={styles.customInput}
							multiple
						/>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<div className="d-flex flex-column">
						<span>Número de preguntas:</span>
						<input
							type="text"
							value={maxPreguntas}
							onChange={(event) => setMaxPreguntas(event.target.value)}
							placeholder="Número de preguntas"
							className={styles.inputText}
						/>
					</div>
				</div>
				<div className="col">
					<div className="d-flex flex-column">
						<span className="invisible">spacer</span>
						<button onClick={handleFileUpload}>¡Desordenar!</button>
					</div>
				</div>
			</div>
			<div className="text-container mt-2">
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
