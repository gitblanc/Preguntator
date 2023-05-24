function shuffleArray(array) {
	// Implementación del algoritmo de Fisher-Yates para desordenar un array
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export function desordenarPreguntasRespuestas(texto) {
	const lines = texto.split("\n");
	const preguntasRespuestas = [];

	let preguntaActual = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		console.log(line.startsWith());
		if (line.startsWith("?:")) {
			preguntaActual = {
				pregunta: line.substring(3), // Eliminar el prefijo '?:'
				respuestas: [],
				respuestasCorrectas: [],
			};
			preguntasRespuestas.push(preguntaActual);
		} else if (line.startsWith("$")) {
			// Es una respuesta correcta
			let respuesta = line.substring(1); // Eliminar el prefijo '$'
			respuesta = respuesta.substring(2); // Eliminar el prefijo 'a.', 'b.', 'c.', 'd.'
			preguntaActual.respuestas.push(respuesta);
			preguntaActual.respuestasCorrectas.push(respuesta);
		} else if (
			// Respuesta normal
			line.startsWith("a.") ||
			line.startsWith("b.") ||
			line.startsWith("c.") ||
			line.startsWith("d.") ||
			line.startsWith("e.") ||
			line.startsWith("f.") ||
			line.startsWith("g.")
		) {
			const respuesta = line.substring(2); // Eliminar el prefijo 'a.', 'b.', 'c.', 'd.'
			preguntaActual.respuestas.push(respuesta);
		}
	}

	// Desordenar el orden de las preguntas
	shuffleArray(preguntasRespuestas);

	// Desordenar las respuestas dentro de cada pregunta
	preguntasRespuestas.forEach((pregunta) => {
		shuffleArray(pregunta.respuestas);
	});

	// Generar el nuevo objeto con las preguntas y respuestas desordenadas
	const preguntasRespuestasDesordenadas = preguntasRespuestas.map(
		(pregunta, index) => {
			const respuestasDesordenadas = pregunta.respuestas.map((respuesta, i) => {
				const respuestaIndex = String.fromCharCode(97 + i); // Convierte el índice a su equivalente en caracteres (a, b, c, ...)
				const esRespuestaCorrecta =
					pregunta.respuestasCorrectas.includes(respuesta);
				return {
					respuestaIndex: respuestaIndex,
					respuesta: respuesta,
					esRespuestaCorrecta: esRespuestaCorrecta,
				};
			});

			return {
				pregunta: pregunta.pregunta,
				respuestas: respuestasDesordenadas,
			};
		}
	);

	return preguntasRespuestasDesordenadas;
}
