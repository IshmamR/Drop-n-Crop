import React, { useState, createRef } from 'react';

import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { base64StringToFile, getFileExtensionOfBase64, image64ToCanvasRef, downloadBase64File } from '../utils/FileUtils';

const acceptedFileTypesArray = ['image/x-png', 'image/png', 'image/x-jpg', 'image/jpeg', 'image/gif'];

const DropAndCrop = () => {
	const [msg, setMsg] = useState(null);
	const [imgSrc, setImgSrc] = useState(null);
	const [imgRef, setImgRef] = useState({});
	const [crop, setCrop] = useState({ 
		unit: 'px', x: '0', y:'0'
	});
	const [canvasRef] = useState(createRef());

	// Verify file for image files
	const maxSize = 10485760; // 10 Megabyte
	const verifyFileSize = (file) => {
		if(file !== null && file.size > maxSize) {
			alert("You file is too big Oni-chan");
			return false;
		}
		if (!acceptedFileTypesArray.includes(file.type)) {
			setMsg({
				text: "Please insert a valid image file",
				color: "red"
			});
			return false;
		}
		// console.log(file);
		return true;
	}

	const handleOnDrop = (files, rejFiles, e) => {
		handleClear(e);
		if (rejFiles && rejFiles.length > 0) {
			setMsg({
				text: "Please insert a valid image file",
				color: "red"
			});
		}
		var imgFile = files.length > 0 ? files[0] : null;
		if (imgFile !== null && verifyFileSize(imgFile)) {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				// console.log(imgFile);
				setImgSrc(reader.result);
			}, false);
			reader.readAsDataURL(imgFile);
			setMsg(null);
		}
	}

	const handleImageLoaded = (image) => {
		setImgRef({
			scaleX : image.naturalWidth / image.width,
			scaleY : image.naturalHeight / image.height
		});
	}
	const handleOnCropChange = (cropped) => {
		setCrop(cropped);
		// console.log(crop, cropped);
	}
	const handleOnCropComplete = (cropped, percentCrop) => {
		// console.log(cropped, percentCrop);
		const canvasCurrentRef = canvasRef.current;
		const img64Src = imgSrc;
		// console.log(imgRef);
		image64ToCanvasRef(canvasCurrentRef, img64Src, cropped, imgRef);
	}

	const handleDownload = (e) => {
		e.preventDefault();
		const canvasCurrentRef = canvasRef.current;
		const fileExtension = getFileExtensionOfBase64(imgSrc);
		const croppedImgData = canvasCurrentRef.toDataURL('image/' + fileExtension);
		const fileName = "croppedImage." + fileExtension;
		// base64StringToFile(croppedImgData, fileName); // for upload purposes
		downloadBase64File(croppedImgData, fileName);
		setMsg({
			text: "Thank you",
			color: 'green'
		})
	}

	const handleClear = (e) => {
		e.preventDefault();
		const canvas = canvasRef.current;
		if(canvas && canvas !== null) {
			const ctx = canvas.getContext('2d');
			if(ctx !== null) ctx.clearRect(0,0, canvas.width, canvas.height);
			setImgSrc(null);
			setImgRef({});
			setCrop({ unit: 'px' });
			setMsg(null);
		}
		else {
			setMsg({
				text: "Nothing to clear",
				color: 'yellow'
			});
		}
	}

	return (
		<div className="DropAndCrop min-h-screen pb-10">
		<div className="w-full flex items-center justify-center my-4">
			<Dropzone onDrop={handleOnDrop} accept={acceptedFileTypesArray} multiple={false} >
				{({getRootProps, getInputProps}) => (
				<div className="max-w-xs w-10/12 border border-dashed border-black cursor-move bg-gray-100 p-5">
					<div
						{...getRootProps({
							className: 'dropzone',
							onDrop: (event, file) => {
								handleOnDrop(event.dataTransfer.files, null, event)
								event.stopPropagation() 
								event.preventDefault()
							}
						})}
					>
						<input className="bg-gray-400 w-full h-full" {...getInputProps()} />
						<p className="text-gray-700 cursor-pointer mb-2 text-center">
							Drag and drop image here
						</p>
						<button className="bg-blue-400 hover:bg-blue-500 hover:text-white text-center w-full p-2 shadow-sm rounded-sm">
							or click to select image
						</button>
					</div>
				</div>
				)}
			</Dropzone>
		</div>

		{msg? 
			(<div className={`w-40 text-center bg-${msg.color}-500 bg-opacity-50 border-2 border-${msg.color}-600 p-2 mx-auto my-2`}>{msg.text}</div>) 
			: ''}

		<div className="block text-center">
			<button onClick={handleClear} className="bg-indigo-500 rounded-sm text-white shadow-md hover:shadow-none p-2 mb-3">
				Clear
			</button>
		</div>
		
		<div className="w-11/12 md:w-7/12 mx-auto grid md:grid-cols-2">
			{imgSrc !== null ? 
				<>
				<ReactCrop 
					src={imgSrc} crop={crop} className="mx-auto"
					onImageLoaded={handleImageLoaded} 
					onChange={handleOnCropChange} 
					onComplete={handleOnCropComplete} 
				/>
				<div className="text-center">
					<canvas className="mx-auto mt-4 md:mt-0" ref={canvasRef}></canvas>
					<button 
						className="bg-green-400 hover:bg-green-500 text-white p-2 mt-6"
						onClick={handleDownload}
					>
						Download
					</button>
				</div>
				</>
				: ''
			}
		</div>
		</div>
	)
}

export default DropAndCrop;
// <img className="border border-gray-100" src={imgSrc} alt="Preview Image" /> 