import React, {useState} from 'react'
import CenteredModal from "../../Components/CenteredModal";
import {LargeButton, PaddingBox, StyledInput} from "../../styles";
import ImageSkeletonRenderer from "../../Components/ImageComponents/ImageSkeletonRenderer";
import {onchain} from "../../func";
import {ProveStatus} from "../ImageListPages/ProveListPage";
import {IProveImage} from "../../func/type";
import {useRecoilState} from "recoil";
import {nicknameState} from "../../states/loginState";
import {useNavigate} from "react-router-dom";

const EmailToProvePage = () => {
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const pathItems = window.location.pathname.split('/');

    const initReqData: any = {
        userNickname: nickname,
        creatorNickname: pathItems[3],
        imageTitle: pathItems[4],
        phrase: pathItems[5],
        uri: pathItems[6],
    };


    const [reqData, setReqData] = useState<any>(initReqData);
    const [modal, setModal] = useState(true);
    const [completeModal, setCompleteModal] = useState(false);

    const nav = useNavigate();

    return (
        <div style={{width:'100%', height:'100%'}}>
            <CenteredModal
                show={modal}
                onHide={() => setModal(false)}
                body={
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                        <PaddingBox>
                            <div
                                style={{
                                    display: 'flex',
                                    borderRadius: '16px',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: 'fit-content',
                                    border: '1px solid rgba(0,0,0,0.5)',
                                    alignItems: 'center',
                                }}
                            >
                                <div style={{ marginTop: 16 }}>
                                    <ProveStatus proveStatus={0} />
                                </div>
                                <ImageSkeletonRenderer
                                    itemList={[
                                        {
                                            creator: reqData.creatorNickname,
                                            creatorNickname: reqData.userNickname,
                                            collection: 'asdf',
                                            name: reqData.imageTitle,
                                            uri: reqData.uri,
                                            price: 0,
                                            expiry: 0,
                                            description: '',
                                        },
                                    ]}
                                    routeUrl="/Images"
                                    style={{ wrapper: { padding: '12px 30px 30px' } }}
                                    skeletonWidth={130}
                                    skeletonHeight={130}
                                    hideDetails
                                />
                                {/*<img src="" style={{ width: '130px', height: '130px' }} />*/}
                            </div>
                        </PaddingBox>
                        <PaddingBox>
                            <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Creator Nickname</span>
                            <StyledInput
                                name="creatorNickname"
                                value={reqData.creatorNickname}
                                placeholder="Put Creator Nickname"
                                onChange={e => setReqData({ ...reqData, [e.target?.name]: e.target.value })}
                            />
                        </PaddingBox>
                        <PaddingBox>
                            <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Image Title</span>
                            <StyledInput
                                name="imageTitle"
                                value={reqData.imageTitle}
                                placeholder="Put Image Title"
                                onChange={e => setReqData({ ...reqData, [e.target?.name]: e.target.value })}
                            />
                        </PaddingBox>
                        <PaddingBox>
                            <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Email to Request</span>
                            <StyledInput
                                name="phrase"
                                placeholder="Put Phrase"
                                value={reqData.phrase}
                                onChange={e => setReqData({ ...reqData, [e.target?.name]: e.target.value })}
                            />
                        </PaddingBox>
                    </div>
                }
                footer={
                    <LargeButton
                        style={{ margin: '0px 16px 16px' }}
                        disabled={!reqData.creatorNickname || !reqData.phrase || !reqData.imageTitle}
                        onClick={() => {
                            onchain
                                .proveImage({
                                    userNickname: nickname,
                                    creatorNickname: reqData.userNickname,
                                    imageTitle: reqData.imageTitle,
                                    phrase: reqData.phrase,
                                })
                                .then(data => {
                                    setModal(false);
                                    setReqData(initReqData);
                                    setCompleteModal(true);
                                });
                        }}
                    >
                        Prove Ownership of Image
                    </LargeButton>
                }
            />

            <CenteredModal
                title="Submitting phrase completed"
                show={completeModal}
                onHide={() => setCompleteModal(false)}
                body={
                    <p style={{ textAlign: 'center', fontWeight: 400, fontSize: '12px' }}>
                        Your proof went perfectly.
                        <br /> There will be no legal issues and the person who reported <br />
                        it will know that you have proved it. Thank you for your proof process.
                    </p>
                }
                footer={<LargeButton onClick={() => {setCompleteModal(false); nav("/profile/prove-list")}}>Go to prove List</LargeButton>}
            />

        </div>
    )
}

export  default  EmailToProvePage