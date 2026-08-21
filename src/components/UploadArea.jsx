import { useEffect, useState } from "react";
import { Upload, RotateCcw, Download } from "lucide-react";
import Cropper from "react-easy-crop";

import goaFrame from "../assets/k1.png";
import coconut from "../assets/coconut.png";
import camera from "../assets/camera.png";
import leaf from "../assets/leaf.png";
import sampleFinal from "../assets/sample-final.png";

import paperFlipSound from "../assets/paper-flip.mp3";
import leafRustleSound from "../assets/leaf-rustle.mp3";

function UploadArea() {
  const [image, setImage] = useState(null);
  const [sampleOpen, setSampleOpen] = useState(false);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /* =========================================================
     FILE SELECTION
     ========================================================= */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);

    // Reset editor
    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);

    setCroppedAreaPixels(null);

    // Allow selecting the same file again
    event.target.value = "";
  };


  /* =========================================================
     CLEAN UP IMAGE URL
     ========================================================= */

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);


  /* =========================================================
     CROP
     ========================================================= */

  const handleCropComplete = (
    croppedArea,
    croppedAreaPixels
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };


  /* =========================================================
     RESET
     ========================================================= */

  const resetPhoto = () => {
    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
  };


  /* =========================================================
     CREATE IMAGE
     ========================================================= */

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();

      img.addEventListener("load", () => {
        resolve(img);
      });

      img.addEventListener("error", reject);

      img.src = url;
    });

const playSound = (soundFile, volume = 0.35) => {
  const audio = new Audio(soundFile);

  audio.volume = volume;

  audio.currentTime = 0;

  audio.play().catch(() => {
    // Browser may block audio until user interaction.
  });
};
  /* =========================================================
     DOWNLOAD
     ========================================================= */

  const handleDownload = async () => {
    try {
      if (!image || !croppedAreaPixels) {
        alert("Please select a photo first.");
        return;
      }

      const photo = await createImage(image);
      const frame = await createImage(goaFrame);

      const canvas = document.createElement("canvas");

      const outputSize = 2000;

      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error(
          "Could not create canvas context."
        );
      }

      /* Draw cropped photo */

      ctx.drawImage(
        photo,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        outputSize,
        outputSize
      );


      /* Draw transparent Goa frame */

      ctx.drawImage(
        frame,
        0,
        0,
        outputSize,
        outputSize
      );


      /* Convert to PNG */

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Unable to create the image.");
            return;
          }

          const downloadUrl =
            URL.createObjectURL(blob);

          const link =
            document.createElement("a");

          link.href = downloadUrl;

          link.download =
            "goa-framed-photo.png";

          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);

          URL.revokeObjectURL(downloadUrl);
        },
        "image/png"
      );

    } catch (error) {
      console.error(
        "Download failed:",
        error
      );

      alert(
        "Something went wrong while creating the image."
      );
    }
  };


  /* =========================================================
     LEAF INTERACTION
     ========================================================= */

  const handleLeafTouch = (event) => {
  const leafImage =
    event.currentTarget.querySelector("img");

  if (!leafImage) {
    return;
  }

  leafImage.classList.remove("leaf-shake");

  void leafImage.offsetWidth;

  leafImage.classList.add("leaf-shake");

  playSound(
    leafRustleSound,
    0.22
  );
};

  /* =========================================================
     RETURN
     ========================================================= */

  return (
    <section className="upload-section">

      {!image ? (

        <>
          {/* =================================================
              LANDING CONTENT
              ================================================= */}

          <div className="upload-content">

            <div className="landing-stage">

              {/* FLOATING CAMERA */}

              <img
                src={camera}
                alt=""
                className="
                  floating-decoration
                  floating-camera
                "
                draggable="false"
              />


              {/* FLOATING COCONUT */}

              <img
                src={coconut}
                alt=""
                className="
                  floating-decoration
                  floating-coconut
                "
                draggable="false"
              />


              {/* MAIN CONTENT */}

              <div className="landing-content">

                <p className="eyebrow">
                  YOUR GOA MOMENT
                </p>


                <h1>
                  Get Your Photo
                  <span>
                    {" "}
                    Framed In Goa
                  </span>
                </h1>


                <p className="upload-description">
                  Upload your favourite photo
                  and give it a little Goa magic.
                </p>


                <label className="upload-button">

                  <Upload size={20} />

                  Upload Your Photo

                  <input
                    type="file"
                    accept="
                      image/jpeg,
                      image/png,
                      image/heic
                    "
                    onChange={handleFileChange}
                    hidden
                  />

                </label>


                <p className="file-info">
                  JPG · PNG · HEIC
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              LEAF

              IMPORTANT:
              This is OUTSIDE .upload-content.

              Therefore its absolute position is calculated
              relative to .upload-section.
              ================================================= */}

          <div
            className="leaf-decoration"
            onPointerDown={handleLeafTouch}
            onMouseEnter={handleLeafTouch}
          >

            <img
              src={leaf}
              alt=""
              draggable="false"
            />

          </div>
          {/* EASTER EGG SAMPLE PHOTO */}

{/* EASTER EGG SAMPLE */}

<div
  className={`sample-easter-egg ${
    sampleOpen ? "sample-open" : ""
  }`}
 onClick={() => {
  setSampleOpen((previous) => {
    const nextState = !previous;

    playSound(
      paperFlipSound,
      nextState ? 0.32 : 0.24
    );

    return nextState;
  });
}}
  role="button"
  tabIndex={0}
  aria-label="Preview a finished framed photo"
  onKeyDown={(event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      setSampleOpen(
        (previous) => !previous
      );
    }
  }}
>

  {/* TEXT APPEARS ONLY AFTER OPENING */}

  <div className="sample-message">
    ✨ This is the sample image
    <br />
    you're going to get
  </div>

  <img
    src={sampleFinal}
    alt="Example of a finished framed photo"
    draggable="false"
  />

</div>

        </>

      ) : (

        /* ===================================================
           PHOTO EDITOR
           =================================================== */

        <div className="upload-content">

          <div className="editor-heading">

            <p className="eyebrow">
              ADJUST YOUR PHOTO
            </p>


            <h2>
              Make It <span>Perfect</span>
            </h2>


            <p>
              Drag your photo and use the slider
              to position it inside the Goa frame.
            </p>

          </div>


          {/* =================================================
              FRAME PREVIEW
              ================================================= */}

          <div className="frame-container">

            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={
                handleCropComplete
              }
              showGrid={false}
              objectFit="cover"
            />


            {/* GOA FRAME */}

            <img
              src={goaFrame}
              alt=""
              className="goa-frame"
            />

          </div>


          {/* =================================================
              CONTROLS
              ================================================= */}

          <div className="editor-controls">

            <div className="zoom-control">

              <label htmlFor="zoom">
                Zoom
              </label>


              <input
                id="zoom"
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(event) =>
                  setZoom(
                    Number(event.target.value)
                  )
                }
              />


              <span>
                {zoom.toFixed(1)}x
              </span>

            </div>


            <button
              className="reset-button"
              onClick={resetPhoto}
            >

              <RotateCcw size={17} />

              Reset

            </button>

          </div>


          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="editor-actions">

            <button
              className="change-button"
              onClick={() => setImage(null)}
            >
              Choose Another Photo
            </button>


            <button
              className="download-button"
              onClick={handleDownload}
            >

              <Download size={17} />

              Download

            </button>

          </div>

        </div>

      )}

    </section>
  );
}

export default UploadArea;