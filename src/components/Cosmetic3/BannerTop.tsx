import React from 'react';
import Marquee from 'react-fast-marquee';
import {FaBowlFood} from "react-icons/fa6";
import {FaUtensils} from "react-icons/fa";

interface Props {
    props: string;
    textColor: string;
    bgLine: string;
}

const BannerTop: React.FC<Props> = ({ props, textColor, bgLine }) => {
    return (
        <>
            <div className={`banner-top ${props}`}>
                <Marquee>
                    <div className={`heading6 md:px-[110px] px-12 ${textColor}`}>Welcome</div>
                    <FaBowlFood className="md:text-[32px] text-[24px] text-gray-500" />
                    <div className={`heading6 md:px-[110px] px-12 ${textColor}`}>모든 도시락</div>
                    <FaUtensils className="md:text-[32px] text-[24px] text-gray-500" />
                    <div className={`heading6 md:px-[110px] px-12 ${textColor}`}>모두의 도시락</div>
                    <FaBowlFood className="md:text-[32px] text-[24px] text-gray-500" />
                    <div className={`heading6 md:px-[110px] px-12 ${textColor}`}>모든 도시락</div>
                    <FaUtensils className="md:text-[32px] text-[24px] text-gray-500" />
                    <div className={`heading6 md:px-[110px] px-12 ${textColor}`}>모두의 도시락</div>
                    <FaBowlFood className="md:text-[32px] text-[24px] text-gray-500" />
                    <div className={`heading6 md:px-[110px] px-12 ${textColor}`}>Modo Modo</div>
                    <FaUtensils className="md:text-[32px] text-[24px] text-gray-500" />
                </Marquee>
            </div>
        </>
    );
}

export default BannerTop;
