import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const [images, setImages] = useContext(ImageContext);
  const defaultFileName = "이미지 파일을 업로드 해주세여";

  const [files, setFiles] = useState(null);

  const [fileName, setFileName] = useState(defaultFileName);

  const [percent, setPercent] = useState(0);

  const [imgSrc, setImgSrc] = useState(null);

  const imageSelectHandler = (event) => {
    const imageFile = event.target.files[0];
    setFiles(imageFile);
    setFileName(imageFile.name);
    // 첨부한 파일 미리보기
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const onSubmit = async (e) => {
    // 기본 새로 고침 방지
    e.preventDefault();
    const formData = new FormData();
    formData.append("images", files);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
          setFileName(defaultFileName);
        },
      });
      console.log({ res });
      setImages([...images, res.data]);
      toast.success("이미지 업로드 성공");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      console.error({ err });

      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);

      toast.error("fail");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* {percent} */}
      <img
        src={imgSrc}
        className={`image-preview ${imgSrc && "image-preview-show"}`}
      ></img>
      <ProgressBar percent={percent}></ProgressBar>
      <div className="file-dropper">
        {fileName}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>

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
