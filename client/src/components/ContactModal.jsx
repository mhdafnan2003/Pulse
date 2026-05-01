import { useEffect, useState } from 'react';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncOpenState = () => setIsOpen(window.location.hash === '#contact-modal');
    syncOpenState();
    window.addEventListener('hashchange', syncOpenState);
    return () => window.removeEventListener('hashchange', syncOpenState);
  }, []);

  const closeModal = () => {
    window.location.hash = '';
    setIsOpen(false);
  };

  const sendToWhatsApp = (e) => {
    e.preventDefault();
    const name = document.getElementById('modal-name').value;
    const email = document.getElementById('modal-email').value;
    const phone = document.getElementById('modal-phone').value;
    const service = document.getElementById('modal-service').value;
    const message = document.getElementById('modal-message').value;

    let whatsappMessage = `*New Inquiry from Website*%0A%0A`;
    whatsappMessage += `*Name:* ${encodeURIComponent(name)}%0A`;
    whatsappMessage += `*Email:* ${encodeURIComponent(email)}%0A`;
    whatsappMessage += `*Phone:* ${encodeURIComponent(phone)}%0A`;
    whatsappMessage += `*Service Interested:* ${encodeURIComponent(service)}%0A%0A`;
    whatsappMessage += `*Message:*%0A${encodeURIComponent(message)}`;

    const whatsappNumber = '447956273533';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
    e.target.reset();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="white-popup-block contact-box-items style-2" style={{ maxWidth: 'min(800px, calc(100vw - 40px))', width: '100%', position: 'relative' }}>
        <button type="button" onClick={closeModal} style={{ position: 'absolute', top: 15, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>✕</button>
        <div className="section-title">
          <h6 className="sub-title">
            <img src="/assets/img/home-1/star.svg" alt="img" /> get in touch
          </h6>
          <h2 className="text-anim text-white">Send Us A Message.</h2>
        </div>
        <form id="contact-form-modal" className="contact-form-box" onSubmit={sendToWhatsApp}>
          <div className="row g-4 align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className="form-clt">
                <input type="text" id="modal-name" name="name" placeholder="Full name *" required />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="form-clt">
                <input type="email" id="modal-email" name="email" placeholder="Email address *" required />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="form-clt">
                <input type="tel" id="modal-phone" name="phone" placeholder="Phone number *" required />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="form-clt">
                <div className="form">
                  <select className="single-select w-100" id="modal-service" name="service">
                    <option>Choose an option</option>
                    <option>Student Visas</option>
                    <option>Work Visas</option>
                    <option>Visit Visas</option>
                    <option>International Work</option>
                    <option>Career Support</option>
                    <option>Legal & Compliance</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-clt">
                <textarea id="modal-message" name="message" placeholder="Type your message" required></textarea>
              </div>
            </div>
            <div className="col-lg-12">
              <button type="submit" className="theme-btn">
                <span className="btn_inner">
                  <span className="btn_icon">
                    <span>
                      <i className="fa-brands fa-whatsapp"></i>
                      <i className="fa-brands fa-whatsapp"></i>
                    </span>
                  </span>
                  <span className="btn_text">
                    <span>Send to WhatsApp</span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
