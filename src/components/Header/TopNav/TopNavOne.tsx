'use client'

import React, { useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Props {
    props: string;
    slogan: string;
}

const TopNavOne: React.FC<Props> = ({ props, slogan }) => {
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [isOpenCurrence, setIsOpenCurrence] = useState(false)

    return (
        <>
            <div className={`top-nav md:h-[44px] h-[30px] ${props} relative`}>
                <div className="container mx-auto h-full flex justify-center items-center">
                    <div className="text-center text-button-uppercase text-white">
                        {'Welcome to modomodo'}
                    </div>
                </div>
                <div className="absolute right-10 top-0 h-full flex items-center gap-5 px-4 max-md:hidden">
                    <Link href={'https://www.facebook.com/'} target='_blank'>
                        <i className="icon-facebook text-white"></i>
                    </Link>
                    <Link href={'https://www.instagram.com/'} target='_blank'>
                        <i className="icon-instagram text-white"></i>
                    </Link>
                    <Link href={'https://www.youtube.com/'} target='_blank'>
                        <i className="icon-youtube text-white"></i>
                    </Link>
                    <Link href={'https://twitter.com/'} target='_blank'>
                        <i className="icon-twitter text-white"></i>
                    </Link>
                    <Link href={'https://pinterest.com/'} target='_blank'>
                        <i className="icon-pinterest text-white"></i>
                    </Link>
                </div>
            </div>
        </>
    );
    
}

export default TopNavOne