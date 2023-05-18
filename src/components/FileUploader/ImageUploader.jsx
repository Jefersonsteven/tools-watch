"use client";
import { useState, useRef } from "react";
import styles from "./imageUploader.module.css";
import Image from "next/image";

const ImageUploader = ({ setSelectedFile, form }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    setSelectedFile(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <>
      <div className={styles.imageContainer}>
        <Image
          src={
            imageUrl
              ? imageUrl
              : form.photo
              ? form.photo
              : "/assets/userPhotoDefault.png"
          }
          width={254}
          height={254}
          alt="Uploaded"
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Botón personalizado */}
      <button className={styles.buttonChangePhoto} onClick={handleButtonClick}>
        Cambiar foto
      </button>
    </>
  );
};

export default ImageUploader;
