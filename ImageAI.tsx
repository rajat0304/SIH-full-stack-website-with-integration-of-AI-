import React, { useState, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

const ImageAI = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
      setPrediction(null); // Reset prediction
    }
  };

  const handlePredict = async () => {
    if (!imgRef.current) return;

    // Load the pre-trained model
    const model = await mobilenet.load();

    // Predict the image
    const predictions = await model.classify(imgRef.current);
    if (predictions.length > 0) {
      const topPrediction = predictions[0];
      setPrediction(
        `${topPrediction.className} - ${(topPrediction.probability * 100).toFixed(2)}%`
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-xl font-bold">AI Civic Issue Detection</h1>
      
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {image && (
        <div className="flex flex-col items-center gap-2">
          <img
            src={image}
            alt="Uploaded"
            ref={imgRef}
            className="max-w-xs rounded shadow"
          />
          <button
            onClick={handlePredict}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Predict
          </button>
        </div>
      )}
      
      {prediction && (
        <div className="mt-4 text-lg font-semibold text-green-700">
          Prediction: {prediction}
        </div>
      )}
    </div>
  );
};

export default ImageAI;
