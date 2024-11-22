/* eslint-disable @next/next/no-img-element */
'use client'

import ButtonComponent1 from '@/components/CommonComponents/ButtonComponent1';
import InputComonentForSignInUpPage from '@/components/CommonComponents/InputComonentForSignInUpPage';
import { ArrowIcon2, CrossIcon1, ImageUploadIcon1, LoadingGif, PDFIcon1, PDFUploadIcon1, PencilIcon2, PlusIconInCircle2, SignInUpBriefcaseIcon1, SignInUpUserIcon1, WebsiteUrlIcon1 } from '@/images/ImagesExport';
import axios from 'axios';
import Link from 'next/link';
import React, { SetStateAction, useEffect, useState } from 'react'
import { ReactSortable } from "react-sortablejs";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { roxboroughcfFont } from '@/fonts/Fonts';

interface Params {
    slug: string;
    userName: string;
}

interface ImageItem {
    url: string;
    id: string;
    order: number;
}

interface ServiceImageFile extends File {
    id: string;
    order: number;
}

const mainSectionCSS = "bg-white w-full border border-[#9F885E] rounded-lg drop-shadow-lg lg:px-20 px-5 lg:py-10 py-5";

const MerchantAddAPackagePage: React.FC<{ params: Params }> = ({ params }) => {

    const { userName } = params;

    const router = useRouter();

    const [packageName, setpackageName] = useState('');
    const [packagePrice, setpackagePrice] = useState<number | null>(null);
    const [packageDescription, setpackageDescription] = useState('');
    const [packageImages, setpackageImages] = useState<ImageItem[]>([]);
    const [packageImagesFile, setpackageImagesFile] = useState<ServiceImageFile[]>([]);

    const [loading, setloading] = useState(false);


    async function checkMerchantSession() {
        setloading(true);

        const response = await axios.get(`/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI?userName=${userName}`)

        //! First validation if session exist
        const statusCode = response.data.statusCode;
        if (statusCode === 404) {
            window.location.href = "/";
            return;
        }

        //! Then checking if he is merchant
        const isMerchant = response.data.merchantData.isMerchant;
        if (isMerchant === false) {
            window.location.href = "/";
            return;
        }

        setloading(false);
    }

    async function uploadPackageToDB() {
        setloading(true);

        const formData = new FormData();

        formData.append('userName', userName);
        formData.append('packageName', packageName);
        formData.append('packagePrice', packagePrice !== null ? packagePrice.toString() : '');
        formData.append('packageDescription', packageDescription);

        packageImages.forEach((image, index) => {
            if (image.url.startsWith(`https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com`)) {
                formData.append("packageImages", image.url);
            } else if (image.url.startsWith('blob:')) {
                const file = packageImagesFile.find(file => file.id === image.id);
                if (file) {
                    formData.append("packageImages", file, file.name);
                }
            }
        });

        const response = await axios.post('/api/merchantsAPIs/merchantPackageAddUpdateAPI', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const statusCode = response.data.statusCode;
        const message = response.data.message;
        if (statusCode === 204) {

        } else if (statusCode === 200) {
            toast.success(message, {});

            localStorage.removeItem(userName + '-homepage-data');

            setTimeout(() => {
                router.push(`/merchant/dashboard/${userName}`)
            }, 2000);
            return;
        } else if (statusCode === 404) {
            empytUseStates();
            router.push('/');
            return;
        }

        setloading(false);
    }

    //~ Package Image upload code
    function handleServiceImageChange(e: React.ChangeEvent<HTMLInputElement>) {

        setloading(true);

        if (e.target.files) {

            const exceededSizeFiles: File[] = [];
            const newFilesArray: ServiceImageFile[] = [];

            Array.from(e.target.files).forEach((file, index) => {
                const id = generateUniqueId();
                const order = packageImagesFile.length + index;

                if (file.size <= 400 * 1024) {
                    newFilesArray.push(Object.assign(file, { id, order }));
                } else {
                    exceededSizeFiles.push(file); // Store the files that exceed 400 KB
                }
            });

            if (exceededSizeFiles.length > 0) {
                alert("The following files exceed 400 KB in size and were not added: " + exceededSizeFiles.map(file => file.name).join(', '));
            }

            const totalFilesArray = [...packageImagesFile, ...newFilesArray];

            if (totalFilesArray.length > 5 || packageImages.length > 5) {
                alert("You can only upload a maximum of 5 images in total.");
                setloading(false);
                return;
            }

            const newImagesUrls: ImageItem[] = newFilesArray.map(file => ({ url: URL.createObjectURL(file), id: file.id, order: file.order }));
            const totalImagesUrls = [...packageImages, ...newImagesUrls];

            setpackageImagesFile(totalFilesArray);
            setpackageImages(totalImagesUrls);
        }

        setloading(false);
    }

    function deleteImage(imageId: string) {
        const updatedImages = packageImages.filter(image => image.id !== imageId);
        setpackageImages(updatedImages);

        const updatedFiles = packageImagesFile.filter(file => file.id !== imageId);
        setpackageImagesFile(updatedFiles);
    }

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function empytUseStates() {
        setpackageName("");
        setpackagePrice(0);
        setpackageDescription("");
        setpackageImages([]);
        setpackageImagesFile([]);
    }

    useEffect(() => {
        checkMerchantSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>

            {loading &&
                <>
                    <section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
                        <LoadingGif width={250} height={250} />
                    </section>
                </>
            }

            {!loading &&
                <section>
                    <section className="back-button mt-10">
                        <section className="max-width max-w-screen-xl m-auto px-4">
                            <section className="back-to-profile-button mb-10">
                                <Link className="flex items-center uppercase gap-2 font-bold border-2 border-black rounded-lg drop-shadow-lg px-4 py-2 w-fit" href={`/merchant/dashboard/${userName}`}>
                                    <ArrowIcon2 width={25} height={0} customCSS={""} />
                                    back to profile
                                </Link>
                            </section>
                        </section>
                    </section>

                    <section className="add-a-package-form-section pb-10">
                        <section className="max-width max-w-screen-lg m-auto px-4">
                            <section className={`${mainSectionCSS} mb-10`}>
                                <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>package details <span className="text-red-500">*</span> </p>
                                <section className="input-fields flex flex-col gap-10">
                                    <section className="inputs-1 flex sm:flex-row flex-col justify-between gap-10">
                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"package name "} customTitleCSS={"bg-white"} image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />} inputType={"name"} value={packageName} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setpackageName(e.target.value)} />
                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"package price"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"number"} value={packagePrice !== null ? packagePrice.toString() : ''} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setpackagePrice(e.target.value ? Number(e.target.value) : null)} />
                                    </section>

                                    <section className="inputs-2 flex sm:flex-row flex-col justify-between gap-10 relative">
                                        <textarea rows={4} className="border border-black w-full rounded-lg pt-3 pl-8 h-[50px]" value={packageDescription} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setpackageDescription(e.target.value)}></textarea>
                                        <p className="title capitalize absolute -top-3 left-5 bg-white px-2 font-bold">package description</p>
                                        <p className="pencil-icon absolute top-[15px] left-2"> <PencilIcon2 width={20} height={20} customCSS={''} /> </p>
                                    </section>
                                </section>
                            </section>

                            {/* Gallery Section */}
                            <section className="gallery-section mb-10">
                                <section className={`${mainSectionCSS}`}>
                                    <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>gallery (add upto 5)</p>

                                    <div className="flex justify-between gap-5">
                                        {packageImages.length < 5 &&
                                            <section className="input-fields flex flex-col gap-10 w-fit cursor-pointer">
                                                <label className='cursor-pointer'>
                                                    <ImageUploadIcon1 width={105} height={100} customCSS={"min-w-[105px]"} />
                                                    <input type="file" className='hidden' accept=".jpg, .jpeg" onChange={handleServiceImageChange} multiple />
                                                </label>
                                            </section>
                                        }
                                        <div className="image-preview-container flex justify-between gap-5">
                                            <ReactSortable
                                                list={packageImages}
                                                setList={(newList) => {
                                                    setpackageImages(newList as ImageItem[]);
                                                    const updatedFiles = packageImagesFile.map((file) => {
                                                        const newIndex = newList.findIndex((item) => item.id === file.id);
                                                        file.order = newIndex;
                                                        return file;
                                                    });
                                                    setpackageImagesFile(updatedFiles);
                                                }}
                                                className='grid md:grid-cols-4 grid-cols-2 gap-4'
                                            >
                                                {packageImages.map((preview, index) => (
                                                    <div key={preview.id} className='relative flex justify-center'>
                                                        <img
                                                            className="w-48 h-aut object-cover" // Added object-cover for better image fit
                                                            src={preview.url}
                                                            alt={`Service Image ${index + 1}`} // It's better for accessibility to provide a more descriptive alt attribute
                                                        />
                                                        <div className='absolute top-3 right-2 flex items-center'>
                                                            <button onClick={() => deleteImage(preview.id)}>
                                                                <CrossIcon1 width={20} height={20} customCSS={'invert'} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </ReactSortable>

                                        </div>
                                    </div>

                                    <p className="normal-case text-xs text-gray-500 mt-4">*Upload images so that people can understand your services better</p>
                                </section>
                            </section>

                            <button className='flex m-auto' onClick={uploadPackageToDB}>
                                <ButtonComponent1
                                    middleSide="add package"
                                    rightSide={<PlusIconInCircle2 width={20} height={20} customCSS={''} />}
                                    customButtonCSS="font-extrabold uppercase flex m-auto text-white font-bold gap-4 rounded-lg drop-shadow-lg items-center bg-[#6D6E72] !px-10 !py-5 w-fit" />
                            </button>

                        </section>
                    </section>
                </section>
            }
        </>
    )
}

export default MerchantAddAPackagePage