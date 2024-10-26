import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface StoreInfo {
    id: number | null;
    name: string;
    address: string;
    detailAddress: string;
    phoneNumber: string;
    foodType: string;
    imageUrl: string;
    description: string;
    companyId: string;
    isEditing: boolean;
}

// Define the structure of the Daum Postcode data
interface DaumPostcodeData {
    userSelectedType: string;
    roadAddress: string;
    jibunAddress: string;
    extra?: string[]; // Optional property
}

export const AssignmentContent: React.FC = () => {
    const [storeInfo, setStoreInfo] = useState<StoreInfo>({
        id: null,
        name: '',
        address: '',
        detailAddress: '',
        phoneNumber: '',
        foodType: '',
        imageUrl: '',
        description: '',
        companyId: '',
        isEditing: false,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [originalCompanyId, setOriginalCompanyId] = useState<string>('');
    const [isImageExpanded, setIsImageExpanded] = useState<boolean>(false);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            try {
                const response = await axios.get('/api/stores/by-external-id');

                if (response.data) {
                    setStoreInfo({
                        id: response.data.id,
                        name: response.data.name,
                        address: response.data.address,
                        detailAddress: response.data.detailAddress || '',
                        phoneNumber: response.data.phoneNumber,
                        foodType: response.data.foodType,
                        imageUrl: response.data.imageUrl,
                        description: response.data.description,
                        companyId: response.data.companyId,
                        isEditing: false,
                    });
                    setOriginalCompanyId(response.data.companyId);
                } else {
                    setStoreInfo({
                        id: null,
                        name: '',
                        address: '',
                        detailAddress: '',
                        phoneNumber: '',
                        foodType: '',
                        imageUrl: '',
                        description: '',
                        companyId: '',
                        isEditing: false,
                    });
                }
            } catch (error: any) { // Specify the error type
                console.error('Error fetching store information:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStoreInfo();
    }, []);

    useEffect(() => {
        const loadDaumPostcodeScript = () => {
            const script = document.createElement('script');
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                console.log('Daum postcode script loaded.');
            };
            script.onerror = () => {
                console.error('Failed to load Daum postcode script.');
            };
            document.body.appendChild(script);
        };

        loadDaumPostcodeScript();
    }, []);

    const execDaumPostcode = () => {
        if (!window.daum || !window.daum.Postcode) {
            console.error('Daum postcode service is not available.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data: DaumPostcodeData) { // Use the defined interface
                let addr = '';

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                setStoreInfo(prevState => ({
                    ...prevState,
                    address: addr,
                    detailAddress: data.extra ? data.extra[0] : prevState.detailAddress,
                }));
            }
        }).open();
    };

    const handleEditClick = () => {
        setStoreInfo(prevState => ({ ...prevState, isEditing: true }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setStoreInfo(prevState => ({ ...prevState, [name]: value }));
    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedImage(event.target.files ? event.target.files[0] : null);
    };

    const handleImageUpload = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append('file', selectedImage);

            try {
                const response = await axios.post('/api/stores/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setStoreInfo(prevState => ({
                    ...prevState,
                    imageUrl: response.data,
                }));
                alert('이미지 업로드에 성공하였습니다.');
            } catch (error: any) {
                console.error('이미지 업로드 중 오류가 발생하였습니다:', error.response ? error.response.data : error.message);
                alert('이미지 업로드 중 오류가 발생하였습니다.');
            }
        }
    };

    const handleSaveClick = async () => {
        try {
            if (!storeInfo.companyId) {
                throw new Error('Company ID is missing.');
            }

            const fullAddress = storeInfo.address + ' ' + (storeInfo.detailAddress || '');

            const url = storeInfo.id ? `/api/stores/${originalCompanyId}` : `/api/stores`;
            const method = storeInfo.id ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: {
                    name: storeInfo.name,
                    address: fullAddress,
                    phoneNumber: storeInfo.phoneNumber,
                    foodType: storeInfo.foodType,
                    imageUrl: storeInfo.imageUrl,
                    description: storeInfo.description,
                    companyId: storeInfo.companyId
                }
            });

            setStoreInfo(prevState => ({
                ...response.data,
                isEditing: false,
                companyId: response.data.companyId
            }));

            alert('가게 정보가 성공적으로 등록되었습니다.');

        } catch (error: any) {
            console.error('Error saving store information:', error.response ? error.response.data : error.message);
            alert('Error saving store information.');
        }
    };

    const handleDeleteClick = async () => {
        try {
            if (window.confirm('가게 정보를 삭제하시겠습니까?')) {
                const response = await axios.delete(`/api/stores/${originalCompanyId}`);
                if (response.status === 204) {
                    alert('가게 정보가 성공적으로 삭제되었습니다.');
                    setStoreInfo({
                        id: null,
                        name: '',
                        address: '',
                        detailAddress: '',
                        phoneNumber: '',
                        foodType: '',
                        imageUrl: '',
                        description: '',
                        companyId: '',
                        isEditing: false,
                    });
                } else {
                    alert('Error deleting store information.');
                }
            }
        } catch (error: any) {
            console.error('Error deleting store information:', error.response ? error.response.data : error.message);
            alert('Error deleting store information.');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const toggleImage = () => {
        setIsImageExpanded(prev => !prev);
    };

    const handleCancelClick = () => {
        setStoreInfo({ ...storeInfo, isEditing: false });
    };

    const imageUrl = storeInfo.imageUrl ? storeInfo.imageUrl : '';

    return (
        <div className="review-content p-7 border border-line rounded-xl">
            <div style={{ textAlign: 'center', margin: '0 auto', padding: '20px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {storeInfo.name}
                    {storeInfo.foodType && (
                        <button className="tag ml-2 px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-purple text-purple bg-gray-200 cursor-default">
                            {storeInfo.foodType}
                        </button>
                    )}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', maxHeight: '500px', overflowY: 'auto'}}>
                    {storeInfo.isEditing ? (
                        <>
                            <div style={{ marginBottom: '15px', textAlign: 'left', width: '80%', backgroundColor: 'transparent', padding: '10px', borderRadius: '8px' }}>
                                <label htmlFor="name">가게명:</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={storeInfo.name}
                                    onChange={handleInputChange}
                                    required
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                />
                            </div>
                            <div style={{ marginBottom: '15px', textAlign: 'left', width: '80%', backgroundColor: 'transparent', padding: '10px', borderRadius: '8px' }}>
                                <label htmlFor="address">가게 주소:</label>
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={storeInfo.address}
                                    readOnly
                                    placeholder="Address"
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="detailAddress"
                                    value={storeInfo.detailAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Detail Address"
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                />
                                <button type="button" onClick={execDaumPostcode} className="border-line px-2 py-1 rounded-lg ml-1.5 border">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                                    </svg>
                                </button>


                            </div>
                            <div style={{ marginBottom: '15px', textAlign: 'left', width: '80%', backgroundColor: 'transparent', padding: '10px', borderRadius: '8px' }}>
                                <label htmlFor="phoneNumber">전화번호:</label>
                                <input
                                    id="phoneNumber"
                                    type="text"
                                    name="phoneNumber"
                                    value={storeInfo.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                />
                            </div>
                            <div style={{ marginBottom: '15px', textAlign: 'left', width: '80%', backgroundColor: 'transparent', padding: '10px', borderRadius: '8px' }}>
                                <label htmlFor="foodType">음식 종류:</label>
                                <input
                                    id="foodType"
                                    type="text"
                                    name="foodType"
                                    value={storeInfo.foodType}
                                    onChange={handleInputChange}
                                    required
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                />
                            </div>
                            <div style={{ marginBottom: '15px', textAlign: 'left', width: '80%', backgroundColor: 'transparent', padding: '10px', borderRadius: '8px' }}>
                                <label htmlFor="image">이미지:</label>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange} // Fixed line
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                />
                                <button
                                    className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-10"
                                    onClick={handleImageUpload}
                                >
                                    이미지 업로드
                                </button>
                                {storeInfo.imageUrl && (
                                    <div style={{ margin: '20px 0', cursor: 'pointer' }} onClick={toggleImage}>
                                        <img
                                            src={storeInfo.imageUrl}
                                            alt="Store"
                                            style={{
                                                width: '250px',
                                                height: 'auto',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '15px', textAlign: 'left', width: '80%', backgroundColor: 'transparent', padding: '10px', borderRadius: '8px' }}>
                                <label htmlFor="description">설명:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={storeInfo.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    required
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '15px', padding: '10px', borderTop: '1px solid #ddd' }}>
                                <button className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-10" onClick={handleSaveClick}>저장</button>
                                <button style={{ marginLeft: '5px' }} className="button-main px-4 py-2 bg-gray-400 text-white rounded-lg mt-10" onClick={handleCancelClick}>취소</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{ margin: '2px 0', color: '#333', fontWeight: 'bold' }}>{storeInfo.address}</p>
                            <p style={{ margin: '2px 0', color: '#333', fontWeight: 'bold' }}>{storeInfo.phoneNumber}</p>
                            {storeInfo.imageUrl && (
                                <div style={{ margin: '20px 0', cursor: 'pointer' }} onClick={() => toggleImage()}>
                                    <img
                                        src={storeInfo.imageUrl}
                                        alt="Store"
                                        style={{
                                            width: '250px',
                                            height: 'auto',
                                            transition: 'width 0.3s ease',
                                            borderRadius: '8px',
                                            ...(isImageExpanded ? { width: '450px' } : {}),
                                        }}
                                    />
                                </div>
                            )}
                            <p style={{ color: '#666' }}>{storeInfo.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '15px', padding: '10px', borderTop: '1px solid #ddd' }}>
                                <button className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-10" onClick={handleEditClick}>Edit</button>
                                <button style={{ marginLeft: '5px' }} className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-10" onClick={handleDeleteClick}>Delete</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default {AssignmentContent};
