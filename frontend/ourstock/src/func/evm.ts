


import { Signer, ethers } from 'ethers';
import { SetterOrUpdater } from 'recoil';
import { TPublicKeyState, nicknameState } from '../states/loginState';
import { uploadToIPFS } from './ipfs';
import {
    ImageInfo,
    TokenPurchaseItem,
    IUploadImage,
    IBuyImage,
    IProveImage,
    IReportImage,
    IReportResponse,
    IProveItem,
    IProofResponse,
    OnChainCommunicator,
    TProved,
} from './type';
import { UserManagerABI, MarketplaceABI, OwnerProverABI } from './evmABI';
import { TokenItem } from '../Components/ImageComponents/ImageSkeletonRenderer';

export class EvmOnChainImpl implements OnChainCommunicator {
    private signer: Signer;

    private provider;

    private userManagerAddress: string;

    private userManagerContract: ethers.Contract;

    private marketplaceAddress: string;

    private marketplaceContract: ethers.Contract;

    private ownerProverAddress: string;

    private ownerProverContract: ethers.Contract;

    constructor() {
        // goerli
        // this.userManagerAddress = "0x4bD46975bd9418c1091c1C1593F1216b15Ac5b5F";
        // this.marketplaceAddress = "0xE9945E2208b0A463CBA67306eACFd83b36668F6b";
        // this.ownerProverAddress = "0x3E286397e21198970b51D901A2e8F5EC91739DAB";

        // mumbai
        this.userManagerAddress = "0x3EF4e5e3b32A5Edbbc6EeDb533b1953d9475724E";
        this.marketplaceAddress = "0xD0f1a25a068ED52F6A0B926632d6941DeD5689F2";
        this.ownerProverAddress = "0x0E8AA980406174248B753Ca6833994E4ecfe57bF";

        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        this.userManagerContract = new ethers.Contract(this.userManagerAddress, UserManagerABI, this.signer);
        this.marketplaceContract = new ethers.Contract(this.marketplaceAddress, MarketplaceABI, this.signer);
        this.ownerProverContract = new ethers.Contract(this.ownerProverAddress, OwnerProverABI, this.signer);
    }

    public async walletConnect(
        setAddress: SetterOrUpdater<string>,
        setPublicKey: SetterOrUpdater<TPublicKeyState>,
    ): Promise<void> {
        if (this.userManagerAddress !== "" && this.marketplaceAddress !== "" && this.ownerProverAddress !== "") {
            console.log("walletConnect starts");
        }
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                // Metamask is installed
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log(accounts[0]);
                setAddress(accounts[0]);
            } catch (err: any) {
                console.error(err.mesasge);
            }
        } else {
            // Metamask not installed
            console.log("Please install Metamask");
        }
    }

    // read
    public async checkUserExists(setNickname: SetterOrUpdater<string>): Promise<boolean> {
        try {
            console.log("checkUserExists");

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            const nickname = await this.userManagerContract.getUserNickname(accounts[0]);
            setNickname(nickname);
        } catch (err) {
            console.log(this.checkUserExists.name, err);
            return false;
        }
        return true;
    }

    public async submitUserNickname(userAddress: string, userNickname: string): Promise<void> {
        try {
            await this.userManagerContract.setUserNickname(userAddress, userNickname);
        } catch (err) {
            console.log(this.submitUserNickname.name, err);
        }
    }

    public async getUserNickname(userAddress: string): Promise<string> {
        let nickname;
        try {
            nickname = await this.userManagerContract.getUserNickname(userAddress);
        } catch (err) {
            console.log(this.getUserNickname.name, err);
            throw (err);
        }
        return nickname;
    }

    public async getImageInfo(creatorAddress: string, creatorNickname: string, imageTitle: string): Promise<ImageInfo> {
        let imageInfo = <ImageInfo>{};
        try {
            console.log(creatorAddress, imageTitle);
            const { name, description, uri, price, creator, expiry } = await this.marketplaceContract.getImageByCreatorAndName(creatorAddress, imageTitle);
            imageInfo = <ImageInfo>{
                title: name,
                price,
                expiry,
                description,
                creator,
                creatorNickname,
                imgUrl: uri,
            };
            console.log(imageInfo);
        } catch (err) {
            console.log(err);
        }
        return imageInfo;
    }

    public async tokendataIdToUri(tokenDataId: { creator: string; collection: string; name: string }): Promise<string> {
        const { imgUrl } = await this.getImageInfo(tokenDataId.creator, "", tokenDataId.name);
        return imgUrl;
    }

    public async getAllImageInfoList(): Promise<TokenItem[]> {
        const tokens: TokenItem[] = [];
        try {
            const count = await this.marketplaceContract.latest_id();

            for (let i = 0; i < count; i += 1) {
                // eslint-disable-next-line no-await-in-loop
                const { id, name, description, uri, price, creator, expiry } = await this.marketplaceContract.stock_images(i);
                // eslint-disable-next-line no-await-in-loop
                const creatorNickname = await this.getUserNickname(creator);
                const image = { creator, creatorNickname, collection: `${creatorNickname}'s collection`, name, uri, price, expiry: 0, description: '' };
                tokens.push(image);
                console.log("image", image);
            }
        } catch (err) {
            console.log(err);
            throw (err);
        }
        return tokens;
    }

    public async getUploadedImageList(address: string): Promise<TokenItem[]> {
        const tokens: TokenItem[] = [];
        try {
            const images = await this.marketplaceContract.getUploadedImages(address);
            console.log(images);
            for (let i = 0; i < images.length; i += 1) {
                const image = images[i];
                const creatorNickname = await this.getUserNickname(image.creator);
                const item = { creator: image.creator, creatorNickname: creatorNickname, collection: `${image.creatorNickname}'s collection`, name: image.name, uri: image.uri, price: image.price, expiry: 0, description: image.description };
                tokens.push(item);
            }
        } catch (err) {
            console.log("getUploadedImageList", err);
            throw (err);
        }
        return tokens;
    }

    public async getPurchasedImageList(address: string): Promise<TokenPurchaseItem[]> {
        const tokens: TokenPurchaseItem[] = [];
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const MarketplaceContract = new ethers.Contract(this.marketplaceAddress, MarketplaceABI, signer);

            const images = await MarketplaceContract.getPurchasedImages(address);
            console.log(images);
            for (let i = 0; i < images.length; i += 1) {
                const image = images[i];
                const creatorNickname = await this.getUserNickname(image.creator);
                const item = { creator: image.creator, creatorNickname, collection: `${creatorNickname}'s collection`, name: image.name, uri: image.uri, price: image.price, expiry: 0, description: image.description };
                tokens.push({ token: item, expireDate: 0 });
            }
        } catch (err) {
            console.log("getPurchasedImageList", err);
            throw (err);
        }
        return tokens;
    }

    // write
    public async uploadImage(nft: IUploadImage): Promise<void> {
        const imageUri = await uploadToIPFS(nft.img);
        try {
            // uint256 price, string calldata name, string calldata description, string calldata uri, uint256 expiry
            await this.marketplaceContract.uploadImage(nft.price, nft.title, nft.description, imageUri, 0, { gasLimit: 3000000 });
        } catch (err) {
            console.log("uploadImage", err);
            throw (err);
        }
    }

    public async buyImage(nft: IBuyImage): Promise<void> {
        try {
            const { id, price } = await this.marketplaceContract.getImageByCreatorAndName(nft.creator, nft.imageTitle);
            await this.marketplaceContract.purchaseImage(Number(id), { value: price, gasLimit: 10000000 });
        } catch (err) {
            console.log(err);
            throw (err);
        }
    }

    // owner prover

    public async proveImage(proof: IProveImage): Promise<void> {
        try {
            console.log("prove image ownership: ", proof.imageTitle, proof.userNickname, proof.creatorNickname);
            await this.ownerProverContract.proveOwnership(proof.userNickname, proof.creatorNickname, proof.imageTitle, proof.phrase, {gasLimit: 10000000});
        } catch (err) {
            console.log(err);
            throw (err);
        }
    }

    public async reportImage(report: IReportImage): Promise<void> {
        try {
            console.log("reporting image: ", report.creatorNickname, report.imageTitle, report.randomPhrase);
            await this.ownerProverContract.submitReport(report.creatorNickname, report.imageTitle, report.randomPhrase, {gasLimit: 10000000});
        } catch (err) {
            console.log(err);
            throw (err);
        }
    }

    public async getReportList(nickname: string): Promise<IProveItem[]> {
        const proofs: IProveItem[] = [];
        try {
            console.log("get report list: ", nickname, nickname.length);
            const result = await this.ownerProverContract.getReportList(nickname);

            await Promise.all(
                result.map(async (el: any) => {
                    const { id, name, description, uri, price, creator, expiry } = await this.marketplaceContract.stock_images(el.imageId);
                    const proved: TProved = (el.proved) ? 1 : 0;
                    const proof = {  proved: proved, title: name, creator, requestedDate: new Date(), provedDate: new Date(), keyPhrase: el.phrase,uri: uri};
                    proofs.push(proof);
                })
            )
        } catch (err) {
            console.error("getReportList", err);
            throw (err);
        }
        
        console.log(proofs);
        return proofs;
    }

    public async getProveList(nickname: string): Promise<IProveItem[]> {
        const proofs: IProveItem[] = [];
        try {
            console.log("get prove list: ", nickname, nickname.length);
            const result = await this.ownerProverContract.getProofList(nickname);

            await Promise.all(
                result.map(async (el: any) => {
                    const { id, name, description, uri, price, creator, expiry } = await this.marketplaceContract.stock_images(el.imageId);
                    const creatorNickname = await this.getUserNickname(creator);
                    const proved: TProved = 1;
                    const proof = {  proved: proved, title: name, creator: creatorNickname, requestedDate: new Date(), provedDate: new Date(), keyPhrase: el.phrase, uri};
                    proofs.push(proof);
                })
            )
        } catch (err) {
            console.log("getProveList", err);
            throw (err);
        }

        console.log(proofs);
        return proofs;
    }
}