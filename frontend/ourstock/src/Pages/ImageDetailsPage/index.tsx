import React, {useEffect, useState} from 'react';

import {useNavigate} from 'react-router-dom';
// @ts-ignore
import s1 from '../../images/s1.jpg';
// @ts-ignore
import s2 from '../../images/s2.jpg';
// @ts-ignore
import s3 from '../../images/s3.jpg';
// @ts-ignore
import s4 from '../../images/s4.jpg';
// @ts-ignore
import s5 from '../../images/s5.jpg';
// @ts-ignore
import o1 from '../../images/o1.jpg';
// @ts-ignore
import o2 from '../../images/o2.jpg';
// @ts-ignore
import o3 from '../../images/o3.jpg';
// @ts-ignore
import o4 from '../../images/o4.jpg';
// @ts-ignore
import o5 from '../../images/o5.jpg';

import flagIcon from '../../icons/flag.svg';
import profileIcon from '../../images/profile-icon.png';
import FeedStatusBar from '../../Components/FeedStatusBar';
import Resolution from '../../Components/Resolution';
import ImageSkeletonRenderer, {TokenItem} from '../../Components/ImageComponents/ImageSkeletonRenderer';
import BottomContainer from '../../Components/NavigatorComponents/BottomContainer';
import CreatorInfo from '../../Components/CreatorInfo';
import {onchain} from '../../func';
import {ImageInfo} from '../../func/type';
import {baseColor, ImageContainer, LargeButton, PaddingBox, StyledInput} from '../../styles';
import TopNavigator from "../../Components/NavigatorComponents/TopNavigator";
import CenteredModal from "../../Components/CenteredModal";
import {sendMail} from "../../func/sendMail";

const ImageDetailsPage = () => {
  const nav = useNavigate();
  const nftAddress = window.location.pathname.replace('/images/', '');

  const pathItems = window.location.pathname.split('/');
  const creatorAddress = pathItems[2].replace(/%20/g, ' ');
  const nickname = pathItems[3].replace(/%20/g, ' ');
  const imageTitle = pathItems[4].replace(/%20/g, ' ');
  const [imageInfo, setImageInfo] = useState<ImageInfo>();

  const [otherWorks, setOtherWorks] = useState<TokenItem[]>([]);
  const [similarWorks, setSimilarWorks] = useState<TokenItem[]>([]);


  const initReportData = {
    nickname: nickname,
    title: imageTitle,
    email: '',
    phrase: '',
  };

  const [modal, setModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [reportData, setReportData] = useState<{ nickname: string; title: string; email: string; phrase?: string }>(
      initReportData,
  );
  useEffect(() => {
    onchain.getImageInfo(creatorAddress, nickname, imageTitle).then(info => {
      setImageInfo(info);
      setTimeout(() => {
        setOtherWorks([
          {
            creator: '0x7cdcb7db6176fadcdc75ddaa94cc4b5b9246d81956b9b0b01ab3d503e646752c',
            creatorNickname: '',
            collection: "'s Collection",
            name: 'mildpanic',
            uri: s1,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0x7cdcb7db6176fadcdc75ddaa94cc4b5b9246d81956b9b0b01ab3d503e646752c',
            creatorNickname: '',
            collection: "'s Collection",
            name: 'testing',
            uri: s2,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0x9d2fbc2ade41ba9f720d911e34980768fa555ed77e87e779b1f34fc708543a7e',
            creatorNickname: 'Michael2',
            collection: "Michael2's Collection",
            name: '1234',
            uri: s3,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0x225d39dbec63f34bdafdad218a7c79d0d2d9eac46ca43783668ec4c47fbe1e4c',
            creatorNickname: 'Michael3',
            collection: "Michael3's Collection",
            name: 'testinggg',
            uri: s4,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0xb1ee0eee34e231fd0236b59a6e96f6027a5576bd65417e59edabd233729470c5',
            creatorNickname: 'da guzus',
            collection: "da guzus's Collection",
            name: 'a',
            uri: s5,
            price: 1,
            expiry: 0,
            description: '',
          },
        ]);
        setSimilarWorks([
          {
            creator: '0x7cdcb7db6176fadcdc75ddaa94cc4b5b9246d81956b9b0b01ab3d503e646752c',
            creatorNickname: '',
            collection: "'s Collection",
            name: 'mildpanic',
            uri: o1,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0x7cdcb7db6176fadcdc75ddaa94cc4b5b9246d81956b9b0b01ab3d503e646752c',
            creatorNickname: '',
            collection: "'s Collection",
            name: 'testing',
            uri: o2,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0x9d2fbc2ade41ba9f720d911e34980768fa555ed77e87e779b1f34fc708543a7e',
            creatorNickname: 'Michael2',
            collection: "Michael2's Collection",
            name: '1234',
            uri: o3,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0x225d39dbec63f34bdafdad218a7c79d0d2d9eac46ca43783668ec4c47fbe1e4c',
            creatorNickname: 'Michael3',
            collection: "Michael3's Collection",
            name: 'testinggg',
            uri: o4,
            price: 1,
            expiry: 0,
            description: '',
          },
          {
            creator: '0xb1ee0eee34e231fd0236b59a6e96f6027a5576bd65417e59edabd233729470c5',
            creatorNickname: 'da guzus',
            collection: "da guzus's Collection",
            name: 'a',
            uri: o5,
            price: 1,
            expiry: 0,
            description: '',
          },
        ]);
      }, 2000);
      console.log('item:', info);
    });
  }, []);

  const resolutionList = [
    {
      size: 'LARGE',
      resolution: '4000x2500',
      dpi: '300',
      format: 'jpg',
      value: 1,
    },
    {
      size: 'MEDIUM',
      resolution: '4000x2500',
      dpi: '300',
      format: 'jpg',
      value: 1,
    },
    {
      size: 'SMALL',
      resolution: '4000x2500',
      dpi: '300',
      format: 'jpg',
      value: 1,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
      }}
    >
      <CenteredModal
          show={modal}
          onHide={() => setModal(false)}
          body={
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
              <PaddingBox>
                <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Creator Nickname</span>
                <StyledInput
                    name="nickname"
                    value={reportData.nickname}
                    placeholder="Put Creator Nickname"
                    onChange={e => setReportData({ ...reportData, [e.target?.name]: e.target.value })}
                />
              </PaddingBox>
              <PaddingBox>
                <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Image Title</span>
                <StyledInput
                    name="title"
                    value={reportData.title}
                    placeholder="Put Image Title"
                    onChange={e => setReportData({ ...reportData, [e.target?.name]: e.target.value })}
                />
              </PaddingBox>
              <PaddingBox>
                <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Email to Request</span>
                <StyledInput
                    name="email"
                    placeholder="Put Email Address"
                    value={reportData.email}
                    onChange={e => setReportData({ ...reportData, [e.target?.name]: e.target.value })}
                />
              </PaddingBox>
            </div>
          }
          footer={
            <LargeButton
                style={{ margin: '0px 16px 16px' }}
                disabled={!reportData.nickname || !reportData.email || !reportData.title}
                onClick={() => {
                  const randomPhrase = (Math.random() + 1).toString(36).substring(8);

                  console.log('report data ', reportData)
                  onchain
                      .reportImage({
                        creatorNickname: reportData.nickname,
                        imageTitle: reportData.title,
                        randomPhrase,
                      })
                      .then(data => {
                        const params = {toEmail: reportData.email, imageTitle: reportData.title, creatorNickname: reportData.nickname,
                          phrase: randomPhrase, imageUrl: imageInfo?.imgUrl ,proveUrl:`http://localhost:3000/profile/${reportData.nickname}/${reportData.title}?=${randomPhrase}?=${imageInfo?.imgUrl}` ,thens:() => {
                          console.log('then');
                            setModal(false);
                            setReportData({ ...reportData, phrase: randomPhrase });
                            setCompleteModal(true);
                          }, errs: () => console.log('failed to send mail')}
                        sendMail({...params});
                      });
                }}
            >
              Request for Proof
            </LargeButton>
          }
      />

      <CenteredModal
          show={completeModal}
          onHide={() => setCompleteModal(false)}
          title="Request Completed"
          body={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px' }}>
              <span style={{ marginBottom: '4px' }}>Your request has been sent to</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: baseColor.green, marginBottom: '20px' }}>
              {`"${reportData.email}"`}
            </span>
              <span style={{ marginBottom: '4px' }}>The autogenerated phrase is</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: baseColor.green, marginBottom: '20px' }}>
              {`"${reportData.phrase}"`}
            </span>
            </div>
          }
          footer={
            <LargeButton
                style={{ width: '200px', backgroundColor: 'black', color: 'white' }}
                onClick={() => {
                  setCompleteModal(false);
                  setReportData(initReportData);
                  nav('/profile/report-list')
                }}
            >
              Go to Report List
            </LargeButton>
          }
      />


      <TopNavigator>
        <span style={{ fontSize: '18px', color: imageInfo?.title ? 'black' : 'white' }}>{imageInfo?.title || '.'}</span>
      </TopNavigator>
      <PaddingBox>
        <ImageContainer style={{ minHeight: '300px', height: '300px', borderRadius:'8px' }}>
          <img style={{ width: 'fit-content', maxWidth: '100%', borderRadius:'8px' }} src={imageInfo?.imgUrl} alt={imageInfo?.title} />
        </ImageContainer>
      </PaddingBox>
      <PaddingBox style={{ padding: '0px 16px' }}>
        <span style={{ fontSize: '24px', fontWeight: 700, marginTop: '16px' }}>{imageInfo?.title}</span>
        <span style={{ fontSize: '13px', opacity: 0.7, margin: '8px 0px' }}>{imageInfo?.description}</span>
        <CreatorInfo profileImg={profileIcon} creator={imageInfo?.creatorNickname} />
      </PaddingBox>
      <PaddingBox>
        <FeedStatusBar />
      </PaddingBox>
      <PaddingBox style={{ padding: '0px 16px', marginBottom: '-16px' }}>
        <span style={{ fontSize: '20px', fontWeight: 700, marginTop: '24px' }}>Detail</span>
      </PaddingBox>
      <Resolution list={resolutionList} />
      {/* Description Card Box */}
      {/*Recommend*/}
      <PaddingBox>
        <span style={{ fontWeight: 700, fontSize: '14px' }}>Other works by this artist</span>
      </PaddingBox>
      <div style={{ width: '100%', height: '100%', marginBottom: '32px' }}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0px 16px' }}>
          <ImageSkeletonRenderer
            itemList={otherWorks}
            routeUrl="/images"
            skeletonCount={6}
            skeletonWidth={140}
            skeletonHeight={140}
            style={{ wrapper: { padding: '16px' } }}
            hideDetails
          />
        </div>
      </div>
      <PaddingBox>
        <span style={{ fontWeight: 700, fontSize: '14px' }}>Similar works</span>
      </PaddingBox>
      <div style={{ width: '100%', height: '100%', marginBottom: '32px' }}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0px 16px' }}>
          <ImageSkeletonRenderer
            itemList={similarWorks}
            routeUrl="/images"
            skeletonCount={6}
            skeletonWidth={140}
            skeletonHeight={140}
            style={{ wrapper: { padding: '16px' } }}
            hideDetails
          />
        </div>
      </div>
      {/*/!* nav = /reportNFT -> /reportNFT:id *!/*/}
      {/* nav = /buyNFT -> /buyNFT:id */}
      <BottomContainer style={{ backgroundColor: baseColor.beige }}>
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <LargeButton
            onClick={() => {
              // setReportData({ nickname: el.creator, title: el.title, email: 'email' });
              setModal(true);
            }
          }
            style={{
              width: '48px',
              background: 'white',
              border: '1px solid black',
              color: 'black',
              marginRight: '8px',
              borderRadius: '8px',
            }}
          >
            <img src={flagIcon} alt="report" style={{ width: '15px' }} />
          </LargeButton>
          <LargeButton onClick={() => nav('purchase')}>Buy this Image</LargeButton>
        </div>
      </BottomContainer>
    </div>
  );
};

export default ImageDetailsPage;
