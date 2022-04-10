import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  // const [fileName, setFileName] = useState(defaultFileName);

  const [previews, setPreviews] = useState([]);

  const [percent, setPercent] = useState(0);

  const [imgSrc, setImgSrc] = useState(null);

  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = async (event) => {
    const imageFiles = event.target.files;
    setFiles(imageFiles);

    const imagePreviews = await Promise.all(
      [...imageFiles].map(async (imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (e) =>
              resolve({ imgSrc: e.target.result, fileName: imageFile.name });
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };

  const onSubmit = async (e) => {
    // 기본 새로 고침 방지
    e.preventDefault();
    const formData = new FormData();
    console.log(files);
    if (files == null) return toast.error("최소 한장 이상 첨부하세요");
    for (let file of files) formData.append("images", file);
    formData.append("public", isPublic);

    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
          // setFileName(defaultFileName);
        },
      });
      if (isPublic) setImages([...images, ...res.data]);
      else setMyImages([...myImages, ...res.data]);
      toast.success("이미지 업로드 성공");
      setTimeout(() => {
        setPercent(0);
        // setFileName(defaultFileName);
        setPreviews([]);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      toast.error(err.response.data.message);
      setPercent(0);
      // setFileName(defaultFileName);
      setPreviews([]);
      setImgSrc(null);
      console.error({ err });
    }
  };
  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      src={preview.imgSrc}
      alt=""
      style={{ width: 200, height: 200, objectFit: "cover" }}
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));

  const fileName =
    previews.length === 0
      ? "이미지 파일을 업로드 해주세요"
      : previews.reduce(
          (previos, current) => previos + `${current.fileName}`,
          ""
        );
  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{previewImages}</div>
      <ProgressBar percent={percent}></ProgressBar>
      <div className="file-dropper">
        {fileName}
        <input
          id="image"
          type="file"
          multiple
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">비공개</label>
      <button
        type="submit"
        style={{
          width: "100%",
          height: 40,
          borderRadius: 3,
          cursor: "pointer",
        }}
      >
        제출
      </button>
    </form>
  );
};

export default UploadForm;
