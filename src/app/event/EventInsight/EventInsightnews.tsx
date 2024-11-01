import React from 'react';
import EventItem from './eventItem';
import { eventType } from './eventType';

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
                    <div className="heading4 text-center ">진행 중인 이벤트</div>
                    <div className="list-blog grid md:grid-cols-3 gap-[30px] md:mt-10 mt-6">
                        {/* 최신 데이터 중 상위 3개만 렌더링 */}
                        {sortedData.slice(0, 3).map((event, index) => {
                            const isLongContent = event.content.length > 30;
                            const displayContent = isLongContent ? `${event.content.slice(0, 30)}...<더보기>` : event.content;

                            return (
                                <div key={index} className="event-container  ">
                                    <EventItem
                                        event={{ ...event, content: displayContent }} // 내용 변경
                                        type='style-one'
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default eventInsight;
