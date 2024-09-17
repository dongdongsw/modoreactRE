import React, { useState, useEffect } from 'react';
import { LockKeyOpen } from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from '@phosphor-icons/react';
type Tab = 'address';

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
}

const UserInfo: React.FC<TabButtonProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <LockKeyOpen size={20} />
            <strong className="heading6">개인정보</strong>
        </div>
    );
};

const UserInfoContent: React.FC = () => {
    const [postcodeScriptLoaded, setPostcodeScriptLoaded] = useState(false);
    const [userInfoList, setUserInfoList] = useState<any[]>([]);
    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [newUserInfo, setNewUserInfo] = useState({
        phoneNumber: '',
        email: '',
        postcode: '',
        address: '',
        detailAddress: '',
        extraAddress: '',
        alias: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isAddingInfo, setIsAddingInfo] = useState(false);

    useEffect(() => {
        fetch('/api/userinfo/external')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setUserInfoList(data);
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                setMessage('정보를 불러오는 중 오류가 발생했습니다.');
            });
    }, []);

    useEffect(() => {
        if (!window.daum || !window.daum.Postcode) {
            const script = document.createElement('script');
            script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.onload = () => {
                console.log('Daum Postcode script loaded.');
                setPostcodeScriptLoaded(true);
            };
            script.onerror = () => {
                console.error('Failed to load Daum Postcode script.');
            };
            document.body.appendChild(script);
        } else {
            setPostcodeScriptLoaded(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const toggleExpand = (id: number) => {
        setExpandedItemId(prevId => prevId === id ? null : id);
    };

    const checkAliasDuplication = async (alias: string) => {
        try {
            const response = await fetch(`/api/userinfo/check-alias?alias=${alias}`);
            const data = await response.json();
            return data.isDuplicate;
        } catch (error) {
            console.error('Error checking alias duplication:', error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditing) {
            const aliasExists = userInfoList.some(info => info.alias === newUserInfo.alias);
            if (aliasExists) {
                setMessage('별칭이 이미 사용 중입니다.');
                return;
            }
        }

        const url = editMode !== null ? `/api/userinfo/${editMode}` : '/api/userinfo';
        const method = editMode !== null ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUserInfo),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                setMessage(errorMessage);
                return;
            }

            const data = await response.json();

            alert('정보가 성공적으로 저장되었습니다.');

            if (editMode !== null) {
                setUserInfoList(prevState => prevState.map(info => info.id === editMode ? data : info));
                setEditMode(null);
            } else {
                setUserInfoList(prevState => [...prevState, data]);
            }

            setNewUserInfo({
                phoneNumber: '',
                email: '',
                postcode: '',
                address: '',
                detailAddress: '',
                extraAddress: '',
                alias: ''
            });
            setIsEditing(false);
            setIsAddingInfo(false);

        } catch (error) {
            console.error('Error saving user info:', error);
            setMessage('정보 저장 중 오류가 발생했습니다.');
        }
    };


    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/userinfo/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUserInfoList(prevState => prevState.filter(info => info.id !== id));
                setIsAddingInfo(false);

                alert('정보가 성공적으로 삭제되었습니다.');
            } else {
                throw new Error('삭제 실패');
            }
        } catch (error) {
            console.error('Error deleting user info:', error);
            setMessage('정보 삭제 중 오류가 발생했습니다.');
        }
    };

    const execDaumPostcode = () => {
        if (!postcodeScriptLoaded || !window.daum || !window.daum.Postcode) {
            console.error('Daum Postcode service is not available');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                let addr = '';
                let extraAddr = '';

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                if (data.userSelectedType === 'R') {
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    if (extraAddr !== '') {
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    setNewUserInfo(prevState => ({
                        ...prevState,
                        extraAddress: extraAddr
                    }));
                } else {
                    setNewUserInfo(prevState => ({
                        ...prevState,
                        extraAddress: ''
                    }));
                }

                setNewUserInfo(prevState => ({
                    ...prevState,
                    postcode: data.zonecode,
                    address: addr
                }));
            }
        }).open();
    };

    const handleEdit = (info: any) => {
        setEditMode(info.id);
        setIsEditing(true);
        setNewUserInfo({
            phoneNumber: info.phoneNumber,
            email: info.email,
            postcode: info.postcode,
            address: info.address,
            detailAddress: info.detailAddress,
            extraAddress: info.extraAddress,
            alias: info.alias
        });
        setIsAddingInfo(true);
    };

    const handleTabChange = (alias: string) => {
        setActiveTab((prevActiveTab) => (prevActiveTab === alias ? null : alias));
        setIsAddingInfo(false);
    };

    const handleAddInfoClick = () => {
        setIsAddingInfo(true);
        setActiveTab(null);
    };

    return (
        <div className="user-info-content p-7 border border-line rounded-xl">
            <h5 className="heading5">개인정보 목록</h5>

            <div className="tab-buttons">
                {userInfoList.map(info => (
                    <div key={info.id}>
                        <button
                            type="button"
                            className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${activeTab === info.alias ? 'active' : ''}`}
                            onClick={() => handleTabChange(info.alias)}
                        >
                            <strong className="heading6">{info.alias}</strong>
                            <Icon.CaretDown className={`text-2xl ic_down duration-300 ${activeTab === info.alias ? 'rotate-180' : ''}`} />
                        </button>

                        {activeTab === info.alias && (
                            <div className="tab-content text-content w-full p-7">
                                <div className="user-info-item border-b border-line py-4">
                                    <div className="info">
                                        <p><strong>{info.address} {info.detailAddress} {info.extraAddress}</strong> </p>
                                        <p>{info.phoneNumber}</p>
                                        <p>{info.email}</p>
                                    </div>
                                    <div className="actions mt-4 flex gap-3">
                                        <button className="edit-button" onClick={() => handleEdit(info)}>
                                            수정
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(info.id)}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!isEditing && (
                <button
                    className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-10"
                    onClick={handleAddInfoClick}
                >
                    정보 추가하기
                </button>
            )}

            {/* Add Information Form */}
            {isAddingInfo && (
                <div className="tab-content text-content w-full p-7">
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <h5 className="heading5">정보 관리</h5>
                        <div className="form-group">
                            <input
                                type="text"
                                name="alias"
                                value={newUserInfo.alias}
                                onChange={handleChange}
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                placeholder="이름 : Ex) 학교, 직장"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="phoneNumber"
                                value={newUserInfo.phoneNumber}
                                onChange={handleChange}
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                placeholder="전화번호"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                value={newUserInfo.email}
                                onChange={handleChange}
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                placeholder="이메일"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="postcode"
                                    value={newUserInfo.postcode}
                                    readOnly
                                    className="border-line px-4 py-3 w-40 rounded-lg"
                                    placeholder="우편번호"
                                />
                                <button
                                    type="button"
                                    onClick={execDaumPostcode}
                                    className="border-line px-2 py-1 rounded-lg ml-1.5 border"
                                >
                                    <Icon.MagnifyingGlass  size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address"
                                value={newUserInfo.address}
                                onChange={handleChange}
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                placeholder="주소 : 검색 버튼을 누르세요"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="detailAddress"
                                value={newUserInfo.detailAddress}
                                onChange={handleChange}
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                placeholder="상세 주소"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="extraAddress"
                                value={newUserInfo.extraAddress}
                                onChange={handleChange}
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                placeholder="추가 주소"
                            />
                        </div>
                        <div className="mt-8">
                            <button
                                className="button-main px-4 py-2 bg-green-500 text-white rounded-lg"
                                onClick={handleAddInfoClick}
                            >
                                저장
                            </button>
                        </div>
                    </form>
                    {message && <p className="text-red-500 mt-4">{message}</p>}
                </div>
            )}
        </div>
    );
};

export default UserInfo;
export { UserInfoContent };