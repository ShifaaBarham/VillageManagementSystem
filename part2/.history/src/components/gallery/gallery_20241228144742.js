import React, { useState, useEffect } from "react";
import "./Gallery.css";

const GalleryApp = () => {
  const [galleryImages, setGalleryImages] = useState([]); // المخزن للصور والنصوص 
  const [isAdding, setIsAdding] = useState(false); 
  const [newImage, setNewImage] = useState({ imgFile: null, imgText: "" }); // االعناصر 

  
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
    setGalleryImages(storedImages);
  }, []);

  const saveToLocalStorage = (images) => {
    localStorage.setItem("galleryImages", JSON.stringify(images));
  };

  const handleAddGallery = () => {
    setIsAdding(true);
  };

  const handleCloseButton = () => {
    setIsAdding(false);
    setNewImage({ imgFile: null, imgText: "" }); 
  };

  const handleUpload = () => {
    if (newImage.imgFile && newImage.imgText.trim() !== "") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgBase64 = reader.result;
        const updatedImages = [  ...galleryImages,{ imgBase64, imgText: newImage.imgText },
        ];

        setGalleryImages(updatedImages); 
        saveToLocalStorage(updatedImages); 

        setNewImage({ imgFile: null, imgText: "" });
        setIsAdding(false);
      };

      reader.readAsDataURL(newImage.imgFile);
    } else {
      alert("Please select an image and enter a description.");
    }
  };

  return (
    <section id="Gallery" className="section">
      {}
      <header>
        <button id="add-gallery" onClick={handleAddGallery}>
          Add New Image
        </button>
      </header>

      {isAdding && (
        <section
          id="button-section"
          style={{ display: isAdding ? "block" : "none" }}
        >
          <button id="close-button" onClick={handleCloseButton}>
            X
          </button>
          <h4 id="title-g">Here adding part!</h4>
          <label htmlFor="filee">Upload the image:</label>
          <input
            id="filee"
            type="file"
            accept="image/jpeg, image/png, image/gif"
            onChange={(e) =>
              setNewImage({ ...newImage, imgFile: e.target.files[0] })
            }
          />
          <br />
          <label htmlFor="pr">Write the text:</label>
          <input
            id="pr"
            type="text"
            value={newImage.imgText}
            onChange={(e) =>
              setNewImage({ ...newImage, imgText: e.target.value })
            }
          />
          <br />
          <button id="submitfile" onClick={handleUpload}>
            Submit
          </button>
        </section>
      )}

      {/* شاشة عرض الصور */}
      <section id="gallery-screan">
        {galleryImages.length === 0 ? (
          <p>No images to display.</p>
        ) : (
          galleryImages.map((image, index) => (
            <div className="image-card" key={index}>
              <img src={image.imgBase64} alt={`Image ${index + 1}`} />
              <p>{image.imgText}</p>
            </div>
          ))
        )}
      </section>
    </section>
  );
};

export default GalleryApp;
