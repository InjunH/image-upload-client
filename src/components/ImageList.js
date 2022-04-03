import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";
// 외부에서 영향을 받을때 useEffect 사용
// 외부의 상태를 바꿨다 sideEffect
// useEffect 두가지 정보를 받는다
// 함수 , 실행 시점
const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const imgList = (isPublic ? images : myImages).map((image) => (
    <Link key={image.key} to={`images/${image._id}`}>
      <img alt="" src={`http://localhost:5001/uploads/${image.key}`} />
    </Link>
  ));
  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List ({isPublic ? "공개" : "개인"} 사진)
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {(isPublic ? "개인" : "공개") + "사진 보기"}
        </button>
      )}
      <div className="image-list-container">{imgList}</div>
    </div>
  );
};

export default ImageList;
