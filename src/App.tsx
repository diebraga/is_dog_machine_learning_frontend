import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import ProgressBar from "@ramonak/react-progress-bar";

import "./App.css";

type ImageFile = File & {
  preview: string;
};

const initialState = {
  cat: "0",
  dog: "0",
  other: "0",
};

function App() {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [prediction, setPrediction] = useState(
    initialState as typeof initialState
  );

  const handleDrop = useCallback((acceptedFiles: any) => {
    const selectedImage = acceptedFiles[0];
    setImage(selectedImage as ImageFile);
    const imageUrl = URL.createObjectURL(selectedImage);
    setImageUrl(imageUrl);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (image && imageUrl.length) {
      formData.append("file", image);
      try {
        const response = await axios.post(
          "https://cat-vs-dog-afza.onrender.com/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        setPrediction(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form className="App" onSubmit={handleFormSubmit}>
      <h1>Cat Vs Dog</h1>
      <div className="card">
        <div
          {...getRootProps()}
          style={{
            border: "1px solid white",
            minHeight: "300px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input {...getInputProps()} />
          {!imageUrl && (
            <p>Drag and drop an image file here, or click to select file</p>
          )}
          <div style={{ marginTop: "1rem" }}>
            {imageUrl && (
              <img src={imageUrl} alt="selected image" height={200} />
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "9px" }}>
          <button type="submit">PREDICT</button>{" "}
          <button type="button" onClick={() => {setImageUrl(""), setPrediction(initialState)}}>
            REMOVE
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        "By uploading a picture, this program will analyze the image and predict
        whether it contains a dog or cat."
      </p>
      {Object.entries(prediction).map(([key, value]) => (
        <div key={key}>
          <p>{key}</p>
          <ProgressBar completed={parseInt(value)} />
        </div>
      ))}
    </form>
  );
}

export default App;
