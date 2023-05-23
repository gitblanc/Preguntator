import React from "react";
import "./App.css"; // Import the CSS file
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import logo from "./logo192.png"; // Import the logo image
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import FileUploader from "./components/FileUploader";

const App = () => {
	return (
		<div className="app-container">
			<header className="app-header">
				<img src={logo} alt="App Logo" className="app-logo" />
				<h1 className="app-name">Preguntator</h1>
			</header>

			<main className="app-main">
				<FileUploader />
			</main>

			<footer className="app-footer">
				<p className="footer-content">
					<strong>Made by gitblanc</strong>
					<a
						href="https://github.com/gitblanc"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FontAwesomeIcon icon={faGithub} className="github-icon" />
					</a>
				</p>
			</footer>
		</div>
	);
};

export default App;
