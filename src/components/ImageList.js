import React, { useContext, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";
// 외부에서 영향을 받을때 useEffect 사용
// 외부의 상태를 바꿨다 sideEffect
// useEffect 두가지 정보를 받는다
// 함수 , 실행 시점
const ImageList = () => {
  const {
    images,
    isPublic,
    setIsPublic,
    imageLoading,
    imageError,
    setImageUrl,
  } = useContext(ImageContext);

  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  const loaderMoreImages = useCallback(() => {
    if (images.length === 0 || imageLoading) return;
    const lastImageId = images[images.length - 1]._id;
    setImageUrl(`${isPublic ? "" : "/user/me"} /images?lastid=${lastImageId}`);
  }, [images, imageLoading, isPublic, setImageUrl]);

  useEffect(() => {
    console.log("intersectionsdsd");
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      console.log("intersection", entry.isIntersecting);
      if (entry.isIntersecting) loaderMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages]);

  const imgList = images.map((image, index) => (
    <Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={index + 5 === images.length ? elementRef : undefined}
    >
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
      {imageError && <div>Error....</div>}
      {imageLoading && <div>Loadding </div>}
    </div>
  );
};

export default ImageList;
