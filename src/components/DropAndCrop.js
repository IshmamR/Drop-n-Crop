import React, { useState, createRef } from 'react';

import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { base64StringToFile, getFileExtensionOfBase64, image64ToCanvasRef } from '../utils/FileUtils';

const acceptedFileTypesArray = ['image/x-png', 'image/png', 'image/x-jpg', 'image/jpeg', 'image/gif'];
// console.log(acceptedFileTypesArray);

const DropAndCrop = () => {
	const [maxSize, setMaxSize] = useState(10485760); // 10 Megabyte
	const [imgSrc, setImgSrc] = useState(null);
	const [imgRef, setImgRef] = useState({});
	const [crop, setCrop] = useState({ aspect: 1/1 });
	const [canvasRef, setCanvasRef] = useState(createRef());

	// Verify file for image files
	const verifyFileSize = (file) => {
		if(file !== null && file.size > maxSize) {
			alert("You file is too big Oni-chan");
			return false;
		}
		if (!acceptedFileTypesArray.includes(file.type)) {
			alert("You file is too big Oni-chan");
			return false;
		}
		console.log(file.width);
		return true;
	}

	const handleOnDrop = (files, rejFiles) => {
		if (rejFiles && rejFiles.length > 0) {
			alert("Please insert a valid image file");
		}
		
		var imgFile = files.length > 0 ? files[0] : null;
		// console.log(imgFile);
		if (imgFile !== null && verifyFileSize(imgFile)) {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				// console.log(reader.result);
				setImgSrc(reader.result);
			}, false);
			reader.readAsDataURL(imgFile);
		}
	}

	const handleImageLoaded = (image) => {
		setImgRef({
			scaleX : image.naturalWidth / image.width,
			scaleY : image.naturalHeight / image.height
		});
	}
	const handleOnCropChange = (cropped) => {
		// console.log(cropped);
		setCrop(cropped);
		// console.log(crop);
	}
	const handleOnCropComplete = (cropped, percentCrop) => {
		// console.log(cropped, percentCrop);
		const canvasCurrentRef = canvasRef.current;
		const img64Src = imgSrc;
		// console.log(imgRef);
		image64ToCanvasRef(canvasCurrentRef, img64Src, cropped, imgRef);
	}

	return (
		<>
		<div className="DropAndCrop w-full flex items-center justify-center my-5">
			<Dropzone onDrop={handleOnDrop} accept={acceptedFileTypesArray} multiple={false} >
				{({getRootProps, getInputProps}) => (
				<div className="max-w-xs w-10/12 border border-dashed border-black cursor-move bg-gray-100 p-5">
					<div
						{...getRootProps({
							className: 'dropzone',
							onDrop: event => event.stopPropagation()
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

		<div className="">
			{imgSrc !== null ? 
				<>
				<ReactCrop 
					src={imgSrc} crop={crop} className="w-full md:w-1/2"
					onImageLoaded={handleImageLoaded} 
					onChange={handleOnCropChange} 
					onComplete={handleOnCropComplete} 
				/>
				<canvas ref={canvasRef} className=""></canvas>
				</>
				: ''
			}
		</div>
		</>
	)
}

export default DropAndCrop;
// <img className="border border-gray-100" src={imgSrc} alt="Preview Image" /> 