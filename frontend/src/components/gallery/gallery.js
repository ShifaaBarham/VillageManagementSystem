import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import imageCompression from "browser-image-compression";
import {jwtDecode} from "jwt-decode"; 
import "../../syles/Gallery.css";

const GET_GALLERY = gql`
  query GetGallery($userId: Int!) {
    getGallery(userId: $userId) {
      id
      imgBase64
      imgText
      createdAt
      ownerId
    }
  }
`;

const ADD_IMAGE = gql`
  mutation AddImage($imgBase64: String!, $imgText: String!, $ownerId: Int!) {
    addImage(imgBase64: $imgBase64, imgText: $imgText, ownerId: $ownerId) {
      id
      imgBase64
      imgText
    }
  }
`;

const GalleryApp = () => {
  const getUserDataFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const userData = getUserDataFromToken();
  const userId = userData?.id;

  const { data, loading, error } = useQuery(GET_GALLERY, {
    variables: { userId },
    skip: !userId,
  });

  const [addImage] = useMutation(ADD_IMAGE);
  const [isAdding, setIsAdding] = useState(false);
  const [newImage, setNewImage] = useState({ imgFile: null, imgText: "" });

  const handleUpload = async () => {
    if (newImage.imgFile && newImage.imgText.trim() !== "") {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(newImage.imgFile, options);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imgBase64 = reader.result;
          await addImage({
            variables: {
              imgBase64,
              imgText: newImage.imgText,
              ownerId: userData.id,
            },
            refetchQueries: [{ query: GET_GALLERY, variables: { userId: userData.id } }],
          });
          setNewImage({ imgFile: null, imgText: "" });
          setIsAdding(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        alert("Error compressing image: " + error.message);
      }
    } else {
      alert("Please select an image and enter a description.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching images: {error.message}</p>;

  return (
    <section id="Gallery" className="section">
      <header>
        <button id="add-gallery" onClick={() => setIsAdding(true)}>
          Add New Image
        </button>
      </header>

      {isAdding && (
        <section id="button-section">
          <button id="close-button" onClick={() => setIsAdding(false)}>
            X
          </button>
          <h4 id="title-g">Here adding part!</h4>
          <label htmlFor="filee">Upload the image:</label>
          <input
            id="filee"
            type="file"
            accept="image/jpeg, image/png, image/gif"
            onChange={(e) => setNewImage({ ...newImage, imgFile: e.target.files[0] })}
          />
          <br />
          <label htmlFor="pr">Write the text:</label>
          <input
            id="pr"
            type="text"
            value={newImage.imgText}
            onChange={(e) => setNewImage({ ...newImage, imgText: e.target.value })}
          />
          <br />
          <button id="submitfile" onClick={handleUpload}>
            Submit
          </button>
        </section>
      )}

<section id="gallery-screan">
  {data.getGallery.length === 0 ? (
    <p>No images to display.</p>
  ) : (
    data.getGallery.map((image, index) => (
      <div className="image-card" key={index}>
        <img src={image.imgBase64} alt={`Image ${index + 1}`} />
        <p>{image.imgText}</p>

        {image.ownerId === userData.id && <p>(Private)</p>}
      </div>
    ))
  )}
</section>


    </section>
  );
};

export default GalleryApp;
