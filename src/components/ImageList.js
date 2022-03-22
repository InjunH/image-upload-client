import React, { useContext} from 'react';
import { ImageContext } from '../context/ImageContext';

// 외부에서 영향을 받을때 userEffect 사용
// 외부의 상태를 바꿨다 sideEffect
// useEffect 두가지 정보를 받는다
// 함수 , 실행 시점
const ImageList = () => {
    const [images] = useContext(ImageContext);
    const imgList = images.map((image) => 
        <img key={image.key}
            style={{ width:"100%" }} 
            src={`http://localhost:5001/uploads/${image.key}`}/>
                
        );
    return <div> 
        <h3>Image List</h3>
    {imgList}
    </div>
};

export default ImageList;