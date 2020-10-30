import React from 'react'
const today = new Date();

export default function Footer() {
  return (
    <section className="footer pt-5">
      <footer>
        <div style={{backgroundColor: '#1A2027'}}>
          <div className="container">
            <div className="row text-white">
              <div className="col-md-6">
                <h4 style={{fontWeight: 'normal'}}>About Polyient Games</h4> 
                <p className="footer_content">A division of <a href="https://www.polyient.io/" target="_blank">Polyient, Inc.</a>, Polyient Games  is the first open, chain-agnostic investment ecosystem focused on blockchain gaming. </p>
                <a className="btn text-white btn-outline-info" href="https://www.polyient.games/contact" target="_blank"><i className="fa fa-envelope" /> Contact Us</a>
              </div>
              <div className="col-md-3">
                <ul className="list-unstyled ml-4">
                  <li className="text_color_secondary font-weight-bold">Navigation</li>
                  <li><a href="https://www.polyient.games/" target="_blank">Home</a></li>
                  <li><a href="https://www.polyient.games/#faqs" target="_blank">FAQs</a></li>
                  <li><a href="https://www.polyient.games/dashboard" target="_blank">Key Sale</a></li>
                  <li><a href="https://www.polyient.games/#technical_partners" target="_blank">Partners</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center py-4 text-white" style={{fontSize: '14px'}}>
            <span className="footer_copyright_text">&copy; Polyient Games, {today.getFullYear()} All Rights Reserved</span>
            <a href="https://twitter.com/polyientgames" target="_blank" className="ml-4 social"><span className="twitter"><i className="fab fa-twitter" /></span></a>
            <a href="https://discord.gg/fXgVxdp" target="_blank" className="ml-4 social"><span className="discord"><i className="fab fa-discord" /></span></a>
            <a href="https://t.me/polyientgames_official" target="_blank" className="ml-4 social"><span className="telegram"><i className="fab fa-telegram-plane" /></span></a>
          </div>
        </div>
      </footer>
    </section>
  )
}
