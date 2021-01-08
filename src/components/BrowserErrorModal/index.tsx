import React, { useState } from 'react'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const ContentWrapper = styled.div`
  background-color: #161B20;
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;
  textAlign: center;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

export default function BrowserErrorModal({}: {}) {
  // important that these are destructed from the account-specific web3-react context
  const [browserView, setBrowserView] = useState(true)
   let showModal: boolean;

   showModal = (isMobile && typeof window.ethereum == 'undefined')

  function onClick(){
    setBrowserView(false);
    window.location.href = "https://metamask.app.link/dapp/dex.polyient.games";
  }

  function getModalContent() {
      return (
        <UpperSection>
          <CloseIcon onClick={()=>{setBrowserView(false)}}>
            <CloseColor />
          </CloseIcon>
          <ContentWrapper>
            <br/>
            <h5 style={{'textAlign':'center'}}>Your browser isn't web3 enabled so our site will not perform as expected. Please use a mobile web3 enabled browser like MetaMask.
            <br/>
            </h5>
            <br/>
            <button className="btn btn-pool btn-lg btn-block mb-3" onClick={()=>{onClick()}}>Visit on MetaMask</button>
          </ContentWrapper>
        </UpperSection>
      )
  }

  return (
    <>
    {showModal? 
    <Modal isOpen={browserView} onDismiss={()=>{setBrowserView(false)}} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
     :null}
    </>
  )
}
