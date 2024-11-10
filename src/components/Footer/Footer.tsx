import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
    return (
        <div id="footer" className='footer'>
            <div className="footer-main bg-surface">
                <div className="container">
                    <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                        <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
                            <Link href={'/'} className="logo">
                                <div className="heading4">Modo Modo</div>
                            </Link>
                            <div className='flex gap-3 mt-3'>
                                <div className="flex flex-col ">
                                    <span className="text-button">Mail:</span>
                                    <span className="text-button mt-3">Phone:</span>
                                    <span className="text-button mt-3">Address:</span>
                                </div>
                                <div className="flex flex-col ">
                                    <span className=''>modomodo@gmail.com</span>
                                    <span className='mt-3'>031-280-3500</span>
                                    <span className='mt-3 pt-px'>16979 경기도 용인시 기흥구 강남로 40 (구갈동 111)</span>
                                </div>
                            </div>
                        </div>
                        <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                            <div className="list-nav flex justify-between basis-full gap-4">
                                <div className="item flex flex-col basis-1/3">
                                    <div className="text-button-uppercase pb-3">Information</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/notice/NoticeListPage'}>Notice</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/event/EventListPage'}>Event</Link>
                                </div>
                                <div className="item flex flex-col basis-1/3">
                                    <div className="text-button-uppercase pb-3">Customer Services</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/RegisterStore'}>입점문의</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/faqs/FaQsListPage'}>FAQs</Link>
                                </div>
                                <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                                    <div className="text-button-uppercase">Newsletter</div>
                                    <div className="caption1 mt-3">모도의 소식을 더 빠르게 접해보세요!</div>
                                    <div className="input-block w-full h-[52px] mt-4">
                                        <form className='w-full h-full relative' action="post">
                                            <input type="email" placeholder='Enter your e-mail' className='caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line' required />
                                            <button className='w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1'>
                                                <Icon.ArrowRight size={24} color='#fff' />
                                            </button>
                                        </form>
                                    </div>
                                    <div className="list-social flex items-center gap-6 mt-4">
                                        <Link href={'https://www.facebook.com/'} target='_blank'>
                                            <div className="icon-facebook text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'https://www.instagram.com/'} target='_blank'>
                                            <div className="icon-instagram text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'https://www.youtube.com/'} target='_blank'>
                                            <div className="icon-youtube text-2xl text-black"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                        <div className="left flex items-center gap-8">
                            <div className="copyright caption1 text-secondary">©2024 ModoModo. All Rights Reserved.</div>
                        </div>
                        <div className="right flex items-center gap-2">
                            <div className="caption1 text-secondary">대표: Team - Modo Modo</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;
