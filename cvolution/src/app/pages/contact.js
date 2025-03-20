// filepath: /pages/contact.js
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Contact() {
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    street: '',
    plz: '',
    ort: '',
    email: '',
    subject: '',
    message: '',
    agb: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    if (subject) {
      setFormData((prevData) => ({ ...prevData, subject }));
    }
  }, []);

  useEffect(() => {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== '');
    const emailValid = isValidEmail(formData.email);
    setIsFormValid(formData.agb && allFieldsFilled && emailValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <>
      <Head>
        <title>CVolution - Kontakt</title>
        <meta name="description" content="Unsere Bewerbung, deine Entwicklung" />
        <link rel="shortcut icon" href="/images/logo-new.ico" />
      </Head>
      <div className="sub_page">
        <div className="hero_area">
          <header className="header_section">
            <div className="container-fluid">
              <nav className="navbar navbar-expand-lg custom_nav-container">
                <a className="navbar-brand" href="/">
                  <img src="/images/logo.png" alt="" style={{ width: '25%' }} />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className=""></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Angebot
                      </a>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="/service">Angebot</a>
                        <a className="dropdown-item" href="/service-cv">Lebenslauf</a>
                        <a className="dropdown-item" href="/service-motivation">Motivationsschreiben</a>
                        <a className="dropdown-item" href="/service-video">Videobewerbung</a>
                        <a className="dropdown-item" href="/service-career">Laufbahnberatung</a>
                        <a className="dropdown-item" href="/service-rav">Unterstützung beim RAV</a>
                        <a className="dropdown-item" href="/service-salary">Lohnanalyse</a>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/about">Über</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/team">Team</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/selfservice">Selfservice</a>
                    </li>
                    <li className="nav-item active">
                      <a className="nav-link" href="/contact">Kontakt<span className="sr-only">(current)</span></a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </header>
        </div>

        <section className="contact_section layout_padding">
          <div className="container">
            <div className="heading_container heading_center">
              <h2>Kontaktformular</h2>
            </div>
            <div className="row">
              <div className="col-md-8 mx-auto">
                <div className="form-group">
                  <label htmlFor="surname">Vorname</label>
                  <input type="text" className="form-control" id="surname" name="surname" value={formData.surname} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="street">Strasse + Nr.</label>
                  <input type="text" className="form-control" id="street" name="street" value={formData.street} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="plz">PLZ</label>
                  <input type="text" className="form-control" id="plz" name="plz" value={formData.plz} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="ort">Ort</label>
                  <input type="text" className="form-control" id="ort" name="ort" value={formData.ort} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" className={`form-control ${!isValidEmail(formData.email) && formData.email.trim() !== '' ? 'invalid-input' : ''}`} id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Betreff</label>
                  <input type="text" className="form-control" id="subject" name="subject" value={formData.subject} onChange={handleChange} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Nachricht</label>
                  <textarea className="form-control" id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="agb">
                    <input type="checkbox" id="agb" name="agb" checked={formData.agb} onChange={handleChange} required />
                    Ich akzeptiere die <a href="/agb" target="_blank">AGB</a>
                  </label>
                </div>
                <div className="form-group">
                  <button className="btn btn-primary" style={{ backgroundColor: '#1f4878', border: 'none' }} id="submitButton" onClick={() => sendEmail()} disabled={!isFormValid}>Senden</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="info_section layout_padding2">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-lg-3 info_col">
                <div className="info_contact">
                  <h4>Adresse</h4>
                  <div className="contact_link_box">
                    <p>CVolution GmbH</p>
                    <p>
                      <i className="fa fa-map-marker" aria-hidden="true"></i>
                      <span>Kasernenstrasse 28, 5000 Aarau</span>
                    </p>
                    <a href="mailto:info@cvolution.ch">
                      <i className="fa fa-envelope" aria-hidden="true"></i>
                      <span>info@cvolution.ch</span>
                    </a>
                  </div>
                </div>
                <div className="info_social">
                  <a href="https://facebook.com/cvolutionswitzerland">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                  <a href="https://linkedin.com/company/cvolution-gmbh">
                    <i className="fa fa-linkedin" aria-hidden="true"></i>
                  </a>
                  <a href="https://instagram.com/cvolution.ch">
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
              <div className="col-md-4 col-lg-3 info_col">
                <div className="info_detail">
                  <h4>Info</h4>
                  <p>Wir legen grossen Wert auf Präzision, Kreativität und Individualität, damit Ihre Bewerbung auffällt und überzeugt. Mit unserer langjährigen Erfahrung und Expertise sind wir der ideale Partner für Ihren beruflichen Erfolg.</p>
                </div>
              </div>
              <div className="col-md-4 col-lg-2 mx-auto info_col">
                <div className="info_link_box">
                  <h4>Links</h4>
                  <div className="info_links">
                    <table className="info-table">
                      <tr>
                        <td><a href="/">Home</a></td>
                        <td><a href="/service">Angebot</a></td>
                      </tr>
                      <tr>
                        <td><a href="/about">Über</a></td>
                        <td><a href="/team">Team</a></td>
                      </tr>
                      <tr>
                        <td><a href="/selfservice">Selfservice</a></td>
                        <td><a href="/contact">Kontakt</a></td>
                      </tr>
                      <tr>
                        <td><a href="/data">Datenschutz</a></td>
                        <td><a href="/impressum">Impressum</a></td>
                      </tr>
                      <tr>
                        <td><a href="/agb">AGB</a></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="footer_section">
          <div className="container">
            <p>&copy; <span id="displayYear"></span> - All Rights Reserved By CVolution GmbH</p>
          </div>
        </section>
      </div>
    </>
  );
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function sendEmail() {
  // Implement the email sending logic here
  alert('Email sent!');
}