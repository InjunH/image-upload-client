import React , {createContext , useState , useEffect } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
    const [images, setImages] = useState([]);

    // 값이 바뀔떄마다 실행
    // useEffect(() => {})
    // 한번만 실행
    useEffect(() => {
        axios.get("/images")
        .then(result => setImages(result.data))
        .catch(err => console.log(err));
    } , [])
    
    return (<ImageContext.Provider value={[images, setImages]}>
    {prop.children}
</ImageContext.Provider>);
};

