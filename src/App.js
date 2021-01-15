import React from 'react';
import DropAndCrop from './components/DropAndCrop';

const App = () => {
	return (
		<div className="App">
			<nav className="block shadow-md text-center bg-blue-500 text-3xl p-2">Drop n Crop</nav>
			<DropAndCrop />
			<footer className="block shadow-md text-center text-white bg-blue-900 text-md p-1">Created by Ishmam</footer>
		</div>
	);
}

export default App;
