import React, { useEffect, useState } from 'react';
import { getAllMenus, updateMenu, addMenu, deleteMenu, Menu } from './MenuService';

export const MenuContent: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedMenus, setEditedMenus] = useState<Menu[]>([]);
    const [newMenus, setNewMenus] = useState<Menu[]>([]);
    const [newMenu, setNewMenu] = useState<Menu>({
        id: Math.random(),
        name: '',
        price: 0,
        image: null,
        imageUrl: '',
        companyId: 44,
    });
    const companyId = 44;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 4; // 한 페이지에 출력될 카드 개수
    const totalPages = Math.ceil(menus.length / itemsPerPage);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await getAllMenus();
            const menusData = Array.isArray(response.data) ? response.data : [];
            setMenus(menusData);
            setEditedMenus(menusData.map(menu => ({ ...menu, image: null })));
        } catch (error) {
            console.error('Error fetching menus:', error);
            setMenus([]);
        }
    };

    const handleEditChange = (index: number, field: string, value: string | number | File | null) => {
        const updatedMenus = [...editedMenus];
        updatedMenus[index] = { ...updatedMenus[index], [field]: value };
        setEditedMenus(updatedMenus);
    };

    const handleNewMenuChange = (field: keyof Menu, value: string | number | File | null) => {
        setNewMenu({ ...newMenu, [field]: value });
    };

    const handleAddMenus = () => {
        if (newMenu.name && newMenu.price > 0) {
            setNewMenus([...newMenus, { ...newMenu, id: Math.random() }]);
            alert('메뉴가 추가되었습니다.');
        }
    };

    const handleSaveAll = async () => {
        try {
            for (const menu of editedMenus) {
                const formData = new FormData();
                formData.append('companyId', String(menu.companyId));
                formData.append('name', menu.name);
                formData.append('price', String(menu.price));
                if (menu.image) {
                    formData.append('image', menu.image);
                }

                await updateMenu(menu.id, formData);
            }
            for (const newMenu of newMenus) {
                const formData = new FormData();
                formData.append('companyId', String(companyId));
                formData.append('name', newMenu.name);
                formData.append('price', String(newMenu.price));
                if (newMenu.image) {
                    formData.append('image', newMenu.image);
                }

                await addMenu(formData);
            }
            fetchMenus();
            setEditMode(false);
            setNewMenus([]);
            setNewMenu({ id: Math.random(), name: '', price: 0, image: null, imageUrl: '', companyId });
            alert('저장되었습니다.');
        } catch (error) {
            console.error('Error updating menus:', error);
        }
    };

    const handleDelete = async (menuId: number) => {
        try {
            await deleteMenu(menuId);
            fetchMenus();
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    const currentItems = menus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="recent_order p-7 border border-line rounded-xl">
            <div className="heading flex items-center justify-between gap-5 flex-wrap">
                <div className="left flex items-center gap-6 gap-y-3 flex-wrap">
                    <h5 className="heading5 text-2xl font-bold mb-4">메뉴 관리</h5>
                    <a
                        href="#"
                        className={`text-button pb-1 border-b-2 ${editMode ? 'border-black' : 'border-transparent'}`}
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? '취소' : '메뉴 수정'}
                    </a>
                </div>
            </div>
            <div className="list grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                {currentItems.map((menu, index) => (
                    <div key={menu.id} className="product-item style-marketplace p-4 border border-line rounded-2xl">
                        {editMode ? (
                            <>
                                <input
                                    type="text"
                                    value={menu.name}
                                    onChange={(e) => handleEditChange(index, 'name', e.target.value)}
                                    placeholder="Menu Name"
                                    className="border p-2 rounded-lg w-full"
                                />
                                <input
                                    type="number"
                                    value={menu.price}
                                    onChange={(e) => handleEditChange(index, 'price', Number(e.target.value))}
                                    placeholder="Menu Price"
                                    className="border p-2 rounded-lg w-full mt-2"
                                />
                                <input
                                    type="file"
                                    onChange={(e) => handleEditChange(index, 'image', e.target.files ? e.target.files[0] : null)}
                                    className="mt-2"
                                />
                                <button
                                    className="bg-red-500 text-white p-2 rounded-lg mt-2"
                                    onClick={() => handleDelete(menu.id)}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold">{menu.name}</h3>
                                <p className="text-gray-600">{menu.price}원</p>
                                {menu.imageUrl && (
                                    <div style={{ width: '100%', height: '0', paddingBottom: '133.33%', position: 'relative', cursor:"default" }}> {}
                                        <img
                                            src={menu.imageUrl}
                                            alt={menu.name}
                                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination mt-5 flex justify-center">
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`mx-1 px-4 py-2 rounded-lg ${
                                    currentPage === index + 1
                                        ? 'text-red-500'  
                                        : 'text-gray-400' 
                                }`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        {currentPage < totalPages && (
                            <button
                                className="mx-1 px-4 py-2 rounded-lg text-gray-400"
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                &gt;
                            </button>
                        )}
                    </div>
                </div>


            )}
            {editMode && (
                <div className="new-menu-upload mt-10">
                    <input
                        type="text"
                        value={newMenu.name}
                        onChange={(e) => handleNewMenuChange('name', e.target.value)}
                        placeholder="음식 이름"
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        value={newMenu.price}
                        onChange={(e) => handleNewMenuChange('price', Number(e.target.value))}
                        placeholder="가격"
                        className="border p-2 rounded-lg w-full mt-2"
                    />
                    <input
                        type="file"
                        onChange={(e) => handleNewMenuChange('image', e.target.files ? e.target.files[0] : null)}
                        className="mt-2"
                    />
                    <button
                        className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-5 mr-2"
                        onClick={handleAddMenus}
                    >
                        추가
                    </button>
                    <button
                        className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-5"
                        onClick={handleSaveAll}
                    >
                        저장
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuContent;
