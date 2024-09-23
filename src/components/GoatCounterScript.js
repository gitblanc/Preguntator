import React, { useEffect } from "react";

const GoatCounterScript = () => {
	useEffect(() => {
		// Crear un elemento script
		const script = document.createElement("script");
		script.src = "https://gc.zgo.at/count.js";
		script.async = true;
		script.dataset.goatcounter = "https://preguntator.goatcounter.com/count";

		// Añadir el script al body
		document.body.appendChild(script);

		// Eliminar el script al desmontar el componente (opcional)
		return () => {
			document.body.removeChild(script);
		};
	}, []); // El array vacío asegura que se ejecute solo una vez, cuando el componente se monta

	return null; // No necesita renderizar nada
};

export default GoatCounterScript;
