import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import {DeleteOutlined} from "@ant-design/icons";
import { Gallery } from 'react-grid-gallery';
import Lightbox from "react-18-image-lightbox";
import 'react-18-image-lightbox/style.css';
import { BASE_URL, TOKEN_KEY } from "../constants";
import axios from "axios";
import { Button, message } from "antd";

const captionStyle={
    backgroundColor: "rgba(0,0,0,0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle={
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
};

function PhotoGallery(props){
    const [images,setImages]=useState(props.images);
    const [curImgIdx,setCurImgIdx]=useState(0);
    const [openLightBox,setOpenLightBox]=useState(false);
    const imageArr=images.map(
        (image)=>{
            return {
                ...image,
                customOverlay: (
                    <div style={captionStyle}>
                        <div>{`${image.user}: ${image.caption}`}</div>
                    </div>
                )
            };
        }
    );

    const onDeleteImage = ()=>{
        if(window.confirm(`Are you sure you want to delete this image?`)){
            const curImg=images[curImgIdx];
            const newImageArr=images.filter((img,index)=>index!==curImgIdx);
            console.log('delete image ', newImageArr);
            const opt={
                method: 'DELETE',
                url: `${BASE_URL}/post/${curImg.postId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };

            axios(opt).then(
                (res)=>{
                    console.log("delete result -> ",res);
                    if(res.status===200){
                        setCurImgIdx(curImgIdx%(imageArr.length-1));
                        setImages(newImageArr);
                    }
                }
            ).catch(
                (err)=>{
                    message.error("Fetch posts failed!");
                    console.log("fetch posts failed: ", err.message);
                }
            );
        }
    };

    const onCurrentImageChange=(index)=>{
        console.log("curIdx ",index);
        setCurImgIdx(index);
    };

    useEffect(
        ()=>{setImages(props.images);},
        [props.images]
    );
    
    console.log("curIdx",curImgIdx);

    return(
        <div style={wrapperStyle}>
            <Gallery
                images={imageArr}
                enableImageSelection={false}
                backdropClosesModal={true}
                currentImageWillChange={onCurrentImageChange}
                onClick={
                    (index)=>{
                        setOpenLightBox(true);
                        setCurImgIdx(index);
                    }
                }
            />
            {openLightBox&&(
                <Lightbox
                    mainSrc={imageArr[curImgIdx].src}
                    nextSrc={imageArr[(curImgIdx+1)%imageArr.length].src}
                    prevSrc={imageArr[(curImgIdx+imageArr.length-1)%imageArr.length].src}
                    onCloseRequest={()=>setOpenLightBox(false)}
                    onMovePrevRequest={()=>setCurImgIdx((curImgIdx+imageArr.length-1)%imageArr.length)}
                    onMoveNextRequest={()=>setCurImgIdx((curImgIdx+1)%imageArr.length)}
                    clickOutsideToClose={true}

                    toolbarButtons={[
                        <Button
                            style={{marginTop: "10px", marginLeft: "5px"}}
                            key="deleteImage"
                            type="primary"
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={onDeleteImage}
                        >
                            Delete Image
                        </Button>
                    ]}
                />
            )}
        </div>
    );
}

PhotoGallery.propTypes={
    images: PropTypes.arrayOf(
        PropTypes.shape({
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired
        })
    ).isRequired
};

export default PhotoGallery;