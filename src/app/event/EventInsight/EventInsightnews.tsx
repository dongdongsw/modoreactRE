import React from 'react'
import EventItem from './eventItem'
import { eventType } from './eventType'

interface Props {
    data: Array<eventType>;
    start: number;
    limit: number;
}

const eventInsight: React.FC<Props> = ({ data, start, limit }) => {
    // 최신순으로 데이터 정렬
    const sortedData = data.sort(
        (a: eventType, b: eventType) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
    return (
        <>
            <div className="news-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">Event Insight</div>
                    <div className="list-blog grid md:grid-cols-3 gap-[30px] md:mt-10 mt-6">
                        {/* 최신 데이터 중 상위 3개만 렌더링 */}
                        {sortedData.slice(0, 3).map((event, index) => (
                            <EventItem key={index} event={event} type='style-one' />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default eventInsight