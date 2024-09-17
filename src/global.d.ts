// global.d.ts // 다음 도로명 주소 불러올 때 필요
interface DaumPostcodeData {
    userSelectedType: 'R' | 'J';
    roadAddress: string;
    jibunAddress: string;
    bname: string;
    buildingName: string;
    apartment: 'Y' | 'N';
    zonecode: string;
}

interface DaumPostcode {
    new (options: { oncomplete: (data: DaumPostcodeData) => void }): {
        open: () => void;
    };
}

interface Window {
    daum: {
        Postcode: DaumPostcode;
    };
}
