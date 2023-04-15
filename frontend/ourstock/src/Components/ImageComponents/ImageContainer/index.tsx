import React from 'react';
import styled from 'styled-components';
import heartIcon from '../../../icons/heart.svg';

interface IImageContainer {
  uri: string;
  alt: string;
  favorite?: boolean;
  style?: any;
}

const ImageContainer = ({ uri, alt, favorite, style }: IImageContainer) => {
  return (
    <ImageContainerBox>
      {favorite && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius:'8px',
            backgroundImage: 'linear-gradient(to bottom, rgba(75, 75, 75, 1) 0%, rgba(0, 0, 0, 0) 30%)',
          }}
        >
          <img
            alt="favorite"
            src={heartIcon}
            style={{
              position: 'absolute',
              right: 0,
              marginTop: '10px',
              marginRight: '10px',
            }}
          />
        </div>
      )}
      <img src={uri} alt={alt} style={{...style, borderRadius: '8px'}} />
    </ImageContainerBox>
  );
};

export default ImageContainer;

export const ImageContainerBox = styled.div`
  display: flex;
  width: fit-content;
  height: 100%;
  min-width: 100px;
  justify-content: center;
  align-items: center;
  position: relative;
`;
