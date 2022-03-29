import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

// ContextAPI 사용
export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  // 컴포넌트 단위 상태 관리
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [me] = useContext(AuthContext);
  // 함수 외에서 발생하는 외부 상태 변경시 사용
  // useEffect(() => {}, []) 첫번째 인자 : 함수 / 두번째 인자 -> 함수를 언제 실행할지
  //   빈 배열 넘길시 한번만 실행
  //   배열 안에 state 넘길시 state 변경 일어날때마다 실행
  useEffect(() => {
    axios
      .get("/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    if (me) {
      setTimeout(() => {
        axios
          .get("/users/me/images")
          .then((result) => setMyImages(result.data))
          .catch((err) => console.log(err));
      }, 0);
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);

  return (
    // value : 하위 자식 컴포넌트들에게 적용 시킨다
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
