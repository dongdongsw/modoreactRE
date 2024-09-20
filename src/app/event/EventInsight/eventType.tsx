export interface eventType {
    id: string;
    title: string;
    content: string;
    createdDate: string;
    imagePath: string; // 추가된 부분
    author?: string;   // 작성자를 사용할 경우
    date?: string;     // 날짜 포맷이 다른 경우
}
