import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const ImagePage = () => {
  const history = useHistory();
  const { imageId } = useParams();
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState();
  const imageRef = useRef();

  useEffect(() => {
    const img = images.find((image) => image._id === imageId);
    if (img) setImage(img);
  }, [images, imageId]);

  useEffect(() => {
    if (image && image._ID === imageId) return;
    axios
      .get(`/images/${imageId}`)
      .then(({ data }) => {
        setError(true);
        setImage(data);
      })
      .catch((err) => {
        setError(true);
        toast.error(err.response.data.message);
      });
  }, [imageId, image]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
    if (error) return <h3>Error...</h3>;
    else if (!image) return <h3>Loading...</h3>;
  }, [me, image]);

  if (!image) return <h2>loadding</h2>;

  const updateImage = (images, image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) => {
        if (a.id < b._id) return 1;
        else return -1;
      }
      // (a, b) =>
      //   new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );

    if (result.data.public)
      setImages((prevData) => updateImage(prevData, result.data));
    setImages((prevData) => updateImage(prevData, result.data));
    setHasLiked(!hasLiked);
  };
  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말 삭제하시겠습니까?")) return;

      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message);
      setImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      setMyImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      history.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteImage = (images) =>
    images.filter((image) => image._id !== imageId);

  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      {/* <img
        alt={imageId}
        style={{ width: "100%" }}
        src={`https://image-upload-tutorial-ij.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
      ></img> */}
      <img
        alt={imageId}
        style={{ width: "100%" }}
        src={`https://test2-ij-image-upload.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
      ></img>
      <span>좋아요 {image.likes.length}</span>
      {me && image.user._id === me.userId && (
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          삭제
        </button>
      )}
      <button style={{ float: "right" }} onClick={onSubmit}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
};

export default ImagePage;
