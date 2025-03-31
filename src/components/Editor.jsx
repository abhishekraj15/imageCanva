import React, { useEffect, useRef, useState } from "react";

function Editor({ image, setSelectedImage }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [fabricInstance, setFabricInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    import("fabric")
      .then((fabric) => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }

        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 500,
          height: 500,
          backgroundColor: "white",
        });
        fabricCanvasRef.current = canvas;

        const imgElement = new Image();
        imgElement.crossOrigin = "anonymous";
        imgElement.src = image;

        imgElement.onload = () => {
          const fabricImg = new fabric.Image(imgElement, {
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });

          const scale = Math.min(500 / fabricImg.width, 500 / fabricImg.height);
          fabricImg.scale(scale);
          canvas.add(fabricImg);
          canvas.centerObject(fabricImg);
          canvas.renderAll();

          setLoading(false);
        };

        imgElement.onerror = () => {
          setError("Failed to load the image.");
          setLoading(false);
        };

        setFabricInstance(fabric);
      })
      .catch((err) => {
        setError("Failed to initialize editor: " + err.message);
        setLoading(false);
      });

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [image]);

  const logCanvasObjects = () => {
    if (!fabricCanvasRef.current) return;
    const objects = fabricCanvasRef.current.getObjects().map((obj) => {
      return {
        type: obj.type,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        fill: obj.fill,
        text: obj.text || null,
      };
    });
    console.log("Canvas Objects:", objects);
  };

  const addText = () => {
    if (!fabricInstance || !fabricCanvasRef.current) return;
    const text = new fabricInstance.IText("Edit me", {
      left: 50,
      top: 50,
      fill: "white",
      fontSize: 20,
      backgroundColor: "black",
      selectable: true,
      hasControls: true,
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.bringToFront(text);
  };

  const addShape = (shape) => {
    if (!fabricInstance || !fabricCanvasRef.current) return;
    let newShape;
    switch (shape) {
      case "circle":
        newShape = new fabricInstance.Circle({
          radius: 50,
          fill: "red",
          left: 100,
          top: 100,
          selectable: true,
          hasControls: true,
        });
        break;
      case "rectangle":
        newShape = new fabricInstance.Rect({
          width: 100,
          height: 50,
          fill: "blue",
          left: 100,
          top: 100,
          selectable: true,
          hasControls: true,
        });
        break;
      case "triangle":
        newShape = new fabricInstance.Triangle({
          width: 100,
          height: 100,
          fill: "green",
          left: 100,
          top: 100,
          selectable: true,
          hasControls: true,
        });
        break;
      case "polygon":
        newShape = new fabricInstance.Polygon(
          [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 50, y: 100 },
          ],
          {
            fill: "purple",
            left: 100,
            top: 100,
            selectable: true,
            hasControls: true,
          }
        );
        break;
      default:
        return;
    }
    fabricCanvasRef.current.add(newShape);
    logCanvasObjects();
  };

  const downloadImage = () => {
    if (!fabricCanvasRef.current) return;
    try {
      const dataURL = fabricCanvasRef.current.toDataURL({ format: "png" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "edited-image.png";
      link.click();
    } catch (err) {
      setError("Failed to download image: " + err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full p-4 sm:p-6 md:p-8">
        <h1 className="text-white text-2xl sm:text-3xl text-center underline font-bold mb-4">
          Image Editor
        </h1>
        {loading && (
          <p className="text-white text-center mb-4">Loading image...</p>
        )}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <canvas
            ref={canvasRef}
            className="border border-white w-full max-w-[500px] h-auto"
          />
          {!loading && !error && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 flex-wrap justify-center">
              <button
                className="bg-green-500 px-4 py-2 rounded"
                onClick={addText}
              >
                Add Text
              </button>
              <button
                className="bg-yellow-500 px-4 py-2 rounded"
                onClick={() => addShape("circle")}
              >
                Add Circle
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded"
                onClick={() => addShape("rectangle")}
              >
                Add Rectangle
              </button>
              <button
                className="bg-green-600 px-4 py-2 rounded"
                onClick={() => addShape("triangle")}
              >
                Add Triangle
              </button>
              <button
                className="bg-purple-500 px-4 py-2 rounded"
                onClick={() => addShape("polygon")}
              >
                Add Polygon
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded"
                onClick={downloadImage}
              >
                Download Image
              </button>
              <button
                className="bg-gray-500 px-4 py-2 rounded"
                onClick={() => setSelectedImage(null)}
              >
                Back to Search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Editor;
