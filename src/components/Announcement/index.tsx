import React, { useState,useEffect} from 'react'
import styled from 'styled-components'


const DetailsDiv = styled.div`
    font-size: 24px;
    a{
      color: #28a745!important;
    }
  `;

export function Announcement() {
  const [announcement] = useState('');
  // const [announcement,setAnnouncement] = useState('');
  useEffect(()=>{
    //  fetch('https://app.polyient.games/api/v1/dex_announcements').then(response => response.json())
    //  .then(json =>{ 
    //     setAnnouncement(json.data)
    //  });
  },[])

  return (
   <>
   {announcement!='' ?
    <div>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-5 mx-auto">
       <DetailsDiv className="dex-card p-4 mb-3" dangerouslySetInnerHTML={{ __html: announcement }} />
        </div>
        </div>
    </div>
    :null}
    </>
  )
} 