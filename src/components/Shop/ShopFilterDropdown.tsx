'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType'
import Product from '../Product/Product';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import HandlePagination from '../Other/HandlePagination';

interface Props {
    data: Array<ProductType>;
    productPerPage: number
    dataType: string | null
}

const ShopFilterDropdown: React.FC<Props> = ({ data, productPerPage, dataType }) => {
    const [layoutCol, setLayoutCol] = useState<number | null>(4)
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [showOnlySale, setShowOnlySale] = useState(false)
    const [sortOption, setSortOption] = useState('');
    const [openSidebar, setOpenSidebar] = useState(false)
    const [type, setType] = useState<string | null>(dataType)
    const [size, setSize] = useState<string | null>()
    const [color, setColor] = useState<string | null>()
    const [brand, setBrand] = useState<string | null>()
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = productPerPage;
    const offset = currentPage * productsPerPage;
    const router = useRouter()

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${value}`)
        setSearchKeyword('')
    }

    const handleLayoutCol = (col: number) => {
        setLayoutCol(col)
    }

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setCurrentPage(0);
    };

    const handleOpenSidebar = () => {
        setOpenSidebar(toggleOpen => !toggleOpen)
    }

    const handleType = (type: string) => {
        setType((prevType) => (prevType === type ? null : type))
        setCurrentPage(0);
    }

    const handleSize = (size: string) => {
        setSize((prevSize) => (prevSize === size ? null : size))
        setCurrentPage(0);
    }

    const handlePriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setPriceRange({ min: values[0], max: values[1] });
            setCurrentPage(0);
        }
    };

    const handleColor = (color: string) => {
        setColor((prevColor) => (prevColor === color ? null : color))
        setCurrentPage(0);
    }

    const handleBrand = (brand: string) => {
        setBrand((prevBrand) => (prevBrand === brand ? null : brand));
        setCurrentPage(0);
    }


    // Filter product data by dataType
    let filteredData = data.filter(product => {
        let isShowOnlySaleMatched = true;
        if (showOnlySale) {
            isShowOnlySaleMatched = product.sale
        }

        let isDataTypeMatched = true;
        if (dataType) {
            isDataTypeMatched = product.type === dataType
        }

        let isTypeMatched = true;
        if (type) {
            dataType = type
            isTypeMatched = product.type === type;
        }

        let isSizeMatched = true;
        if (size) {
            isSizeMatched = product.sizes.includes(size)
        }

        let isPriceRangeMatched = true;
        if (priceRange.min !== 0 || priceRange.max !== 100) {
            isPriceRangeMatched = product.price >= priceRange.min && product.price <= priceRange.max;
        }

        return isShowOnlySaleMatched && isDataTypeMatched && isTypeMatched && isSizeMatched && isPriceRangeMatched && product.category === 'fashion'
    })

    // Create a copy array filtered to sort
    let sortedData = [...filteredData];

    if (sortOption === 'soldQuantityHighToLow') {
        filteredData = sortedData.sort((a, b) => b.sold - a.sold)
    }

    const totalProducts = filteredData.length
    const selectedType = type
    const selectedSize = size
    const selectedColor = color
    const selectedBrand = brand


    if (filteredData.length === 0) {
        filteredData = [{
            id: 'no-data',
            category: 'no-data',
            type: 'no-data',
            name: 'no-data',
            gender: 'no-data',
            new: false,
            sale: false,
            rate: 0,
            price: 0,
            originPrice: 0,
            brand: 'no-data',
            sold: 0,
            quantity: 0,
            quantityPurchase: 0,
            sizes: [],
            variation: [],
            thumbImage: [],
            images: [],
            description: 'no-data',
            action: 'no-data',
            slug: 'no-data'
        }];
    }


    // Find page number base on filteredData
    const pageCount = Math.ceil(filteredData.length / productsPerPage);

    // If page number 0, set current page = 0
    if (pageCount === 0) {
        setCurrentPage(0);
    }

    // Get product data for current page
    let currentProducts: ProductType[];

    if (filteredData.length > 0) {
        currentProducts = filteredData.slice(offset, offset + productsPerPage);
    } else {
        currentProducts = []
    }

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    const handleClearAll = () => {
        setType(null);
        setSize(null);
        setColor(null);
        setBrand(null);
        setPriceRange({ min: 0, max: 100 });
        setCurrentPage(0);
        dataType = null
        setType(dataType);
    };

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{dataType === null ? 'Shop' : dataType}</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>{dataType === null ? 'Shop' : dataType}</div>
                                </div>
                            </div>
                            <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                {['t-shirt', 'dress', 'top', 'swimwear', 'shirt'].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${dataType === item ? 'active' : ''}`}
                                        onClick={() => handleType(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                <div className="input-block lg:w-1/2 sm:w-3/5 w-full md:h-[52px] h-[44px] sm:mt-8 mt-5">
                            <div className='w-full h-full relative'>
                                <input
                                    type="text"
                                    placeholder='Search...'
                                    className='caption1 w-full h-full pl-4 md:pr-[150px] pr-32 rounded-xl border border-line'
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                                />
                                <button
                                    className='button-main absolute top-1 bottom-1 right-1 flex items-center justify-center'
                                    onClick={() => handleSearch(searchKeyword)}
                                >
                                    search
                                </button>
                            </div>
                        </div>
                    <div className="list-product-block relative">
                        <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                            <div className="left flex has-line items-center flex-wrap gap-5">
                                <div
                                    className="filter-sidebar-btn flex items-center gap-2 cursor-pointer"
                                    onClick={handleOpenSidebar}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 21V14" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 10V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 21V12" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 8V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 21V16" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 12V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 14H7" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 8H15" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 16H23" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Filters</span>
                                </div>
                                <div className="choose-layout flex items-center gap-2">
                                    <div
                                        className={`item three-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 3 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(3)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                    <div
                                        className={`item four-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 4 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(4)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                    <div
                                        className={`item five-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 5 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(5)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="right flex items-center gap-3">
                                <label htmlFor='select-filter' className="caption1 capitalize">Sort by</label>
                                <div className="select-block relative">
                                    <select
                                        id="select-filter"
                                        name="select-filter"
                                        className='caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line'
                                        onChange={(e) => { handleSortChange(e.target.value) }}
                                        defaultValue={'Sorting'}
                                    >
                                        <option value="Sorting" disabled>Sorting</option>
                                        <option value="soldQuantityHighToLow">Best Selling</option>
                                        <option value="discountHighToLow">Best Discount</option>
                                        <option value="priceHighToLow">Price High To Low</option>
                                        <option value="priceLowToHigh">Price Low To High</option>
                                    </select>
                                    <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
                                </div>
                            </div>
                        </div>

                        <div className={`list-product hide-product-sold grid lg:grid-cols-3 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7`}>
                                                    {currentProducts.map((item) => (
                                                        item.id === 'no-data' ? (
                                                            <div key={item.id} className="no-data-product">No products match the selected criteria.</div>
                                                        ) : (
                                                            <Product key={item.id} data={item} type='style-one' />
                                                        )
                                                    ))}
                                                </div>

                        {pageCount > 1 && (
                            <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                                <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}

export default ShopFilterDropdown