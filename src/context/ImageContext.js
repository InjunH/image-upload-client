import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// ContextAPI 사용
export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  // 컴포넌트 단위 상태 관리
  const [images, setImages] = useState([]);
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

  return (
    // value : 하위 자식 컴포넌트들에게 적용 시킨다
    <ImageContext.Provider value={[images, setImages]}>
      {prop.children}
    </ImageContext.Provider>
  );
};
