import React, {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {baseColor, LargeButton, PaddingBox, StyledInput, StyledSpan} from '../../../styles';
import TopNavigator from '../../../Components/NavigatorComponents/TopNavigator';
import ImageSkeletonRenderer from '../../../Components/ImageComponents/ImageSkeletonRenderer';
import CreatorInfo from '../../../Components/CreatorInfo';
import CenteredModal from '../../../Components/CenteredModal';

import profileIcon from '../../../images/profile-icon.png';
import BottomContainer from '../../../Components/NavigatorComponents/BottomContainer';
import {onchain} from '../../../func';
import {dateToString} from '../../../func/util';
import {IProveItem} from '../../../func/type';
import {nicknameState} from '../../../states/loginState';
import {sendMail} from "../../../func/sendMail";

interface IProveStatus {
  proveStatus: 0 | 1 | 2 | 3;
}

const EnumProveStatus = {
  0: 'Not Proved',
  1: 'Proved',
  2: 'Prove Requested',
  3: 'Cannot Prove',
};

const EnumProveColor = {
  0: baseColor.darkYellow,
  1: baseColor.green,
  2: baseColor.pink,
  3: baseColor.pink,
};

const ReportListPage = () => {
  const [reportList, setUploadList] = useState<IProveItem[]>([]);
  const initReportData = {
    nickname: '',
    title: '',
    email: '',
    phrase: '',
      uri: '',
  };

  const [nickname, setNickname] = useRecoilState(nicknameState);
  const [modal, setModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [reportData, setReportData] = useState<{ nickname: string; title: string; email: string; phrase?: string; uri?: string }>(
    initReportData,
  );

  useEffect(() => {
    onchain.getReportList(nickname).then(data => {
      setUploadList(data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
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

              onchain
                .reportImage({
                  creatorNickname: reportData.nickname,
                  imageTitle: reportData.title,
                  randomPhrase,
                })
                .then(data => {
                    const params = {toEmail: reportData.email, imageTitle: reportData.title, creatorNickname: reportData.nickname,
                        phrase: randomPhrase, imageUrl: reportData.uri, proveUrl: `https://ourchive-team.github.io/ourstock/${reportData.nickname}/${reportData.title}?phrase=${reportData.phrase}/${reportData.uri}` ,thens:() => {
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
            }}
          >
            Go to Report List
          </LargeButton>
        }
      />

      <TopNavigator>
        <span style={{ fontSize: '18px' }}>Report list</span>
      </TopNavigator>

      <PaddingBox>
        {reportList.map(el => {
          const highlightsColor = EnumProveColor[el.proved];
          return (
            <div
              style={{
                display: 'flex',
                minWidth: 'fit-content',
                flexDirection: 'column',
                padding: '16px',
                border: '1px solid black',
                borderRadius: '16px',
                marginBottom: '16px',
              }}
            >
              <ProveStatus proveStatus={el.proved} />
              <div style={{ display: 'flex', marginTop: '-4px' }}>
                <ImageSkeletonRenderer
                  itemList={[
                    { creator: el.creator, creatorNickname: '', collection: '', name: el.title, uri: el.uri, price: 0, expiry: 0, description: '' },
                  ]}
                  routeUrl="/Images"
                  style={{ wrapper: { paddingLeft: '0px' } }}
                  skeletonWidth={60}
                  skeletonHeight={60}
                  hideDetails
                />

                <div style={{ display: 'flex', width: '100%', flexDirection: 'column', padding: '18px 18px 18px 0px' }}>
                  <StyledSpan
                    style={{
                      fontWeight: 700,
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      marginBottom: '4px',
                    }}
                  >
                    {el.title}
                  </StyledSpan>

                  <div style={{ marginTop: 'auto' }}>
                    <CreatorInfo
                      profileImg={profileIcon}
                      creator={nickname}
                      style={{
                        img: { width: '16px', height: '16px', marginRight: '4px' },
                        text: { fontSize: '10px', fontWeight: 700, marginBottom: '0px', color: 'black' },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.3)', marginBottom: '12px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'auto', rowGap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <StyledSpan style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>Requested Date</StyledSpan>
                  <StyledSpan style={{ whiteSpace: 'nowrap' }}>{dateToString(el.requestedDate)}</StyledSpan>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <StyledSpan style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>Proved Date</StyledSpan>
                  <StyledSpan style={{ color: highlightsColor, whiteSpace: 'nowrap' }}>
                    {dateToString(el.provedDate)}
                  </StyledSpan>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <StyledSpan style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>Key Phrase</StyledSpan>
                  <StyledSpan style={{ color: highlightsColor, whiteSpace: 'nowrap' }}>{el.keyPhrase}</StyledSpan>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <LargeButton
                    onClick={() => {
                      setReportData({ nickname: el.creator, title: el.title, email: 'email', uri: el.uri });
                      setModal(true);
                    }}
                    style={{ width: '114px', minHeight: '30px', height: '30px' }}
                  >
                    Report
                  </LargeButton>
                </div>
              </div>
            </div>
          );
        })}
      </PaddingBox>
      <BottomContainer style={{ backgroundColor: baseColor.beige }} />
    </div>
  );
};
const ProveStatus = ({ proveStatus }: IProveStatus) => {
  const color = EnumProveColor[proveStatus];
  const status = EnumProveStatus[proveStatus];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 12px',
        border: `1px solid ${color}`,
        width: 'fit-content',
        borderRadius: 48,
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: color,
          borderRadius: '50%',
          marginRight: '4px',
        }}
      />
      <span style={{ color, fontSize: '11px' }}>{status}</span>
    </div>
  );
};

export default ReportListPage;
