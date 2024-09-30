import React from 'react';
import { PushPin, Info } from "@phosphor-icons/react";

interface StoreType {
  name: string;
  address: string;
  phoneNumber: string;
  foodType: string;
  imageUrl: string;
  description: string;
}

interface Props {
  store: StoreType;
}

const StoreInfo: React.FC<Props> = ({ store }) => {
  return (
    <div
      className="store-info"
      style={{
        border: '4px solid #FAFAFA',
        borderRadius: '15px',
        padding: '30px',
        fontSize: '25px',
        width: '60%',
        margin: '0 auto',
        backgroundColor: '#FAFAFA'
      }}
    >
      {/* 가게 소개 섹션 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '60px',
        }}
      >
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color:'#737373'  }}>가게 소개</h1>
        <PushPin size={30} color='#737373' />
      </div>
      <p style={{ marginBottom: '20px', fontSize: '20px', color:'#737373' }}>{store.description}</p>
      <hr style={{ marginBottom: '20px', width: '100%' , color:'#737373'}} />

      {/* 가게 정보 섹션 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '60px',
          
        }}
      >
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color:'#737373' }}>가게 정보</h1>
        <Info size={30} color='#737373' />
      </div>

      {/* 가게 세부 정보 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '25px', color:'#737373'}}>상호명</h2>
        <p style={{ fontSize: '25px' , color:'#737373'}}>{store.name}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '25px' , color:'#737373'}}>주소</h2>
        <p style={{ fontSize: '25px' , color:'#737373'}}>{store.address}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '25px' , color:'#737373'}}>전화번호</h2>
        <p style={{ fontSize: '25px' , color:'#737373'}}>{store.phoneNumber}</p>
      </div>
    </div>
  );
};

export default StoreInfo;
