import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div>
      <section id="header">
        <a href="/valid-url"><img src="image/logo.jpg" alt="logo" width="30%"/></a>
        
            
        <div>
          <ul id="navbar">
          <input type="text" placeholder="Search Books" id="search-bar" />

            <li><a href="/" className="active">Home</a></li>
            <li><a href="/products">Books</a></li>
            
            <li><a href="/valid-url">About</a></li>
            
            <li><a href="/valid-url" id="lg-bag"><i className="fal fa-shopping-bag"></i></a>
              <span className="quantity">0</span>
            </li>
            <li><a href="/valid-url" id="close"><i className="far fa-times"></i></a></li>
           
          </ul>
        </div>
        <div id="mobile">
          <a href="/valid-url"><i className="fal fa-shopping-bag"></i>
            <span className="quantity">0</span>
          </a>
          <i id="bar" className="fas fa-outdent"></i>
        </div>
      </section>

      <section id="hero">
        <h4>Trade-in-fair</h4>
        <h2>Super value deals</h2>
        <h1>On all Products</h1>
        <p>Save more with coupons and up to 70% off!</p>
        <button>Shop Now</button>
      </section>

      <section id="feature" className="section-p1">
        <div className="fe-box">
          <img src="https://i.postimg.cc/PrN2Y6Cv/f1.png" alt="" />
          <h6>Free Shipping</h6>
        </div>
        <div className="fe-box">
          <img src="https://i.postimg.cc/qvycxW4q/f2.png" alt="" />
          <h6>Online Order</h6>
        </div>
        <div className="fe-box">
          <img src="https://i.postimg.cc/1Rdphyz4/f3.png" alt="" />
          <h6>Save Money</h6>
        </div>
        <div className="fe-box">
          <img src="https://i.postimg.cc/GpYc2JFZ/f4.png" alt="" />
          <h6>Promotions</h6>
        </div>
        <div className="fe-box">
          <img src="https://i.postimg.cc/4yFCwmv6/f5.png" alt="" />
          <h6>Happy Sell</h6>
        </div>
        <div className="fe-box">
          <img src="https://i.postimg.cc/gJN1knTC/f6.png" alt="" />
          <h6>24/7 Support</h6>
        </div>
      </section>

      <section id="product1" className="section-p1">
        <h2>Featured Products</h2>
        <p> Collection New Modern </p>
        <div className="pro-container">
          <div className="pro" onClick={() => window.location.href='/valid-url'}>
            <img src="" alt="" />
            <div className="des">
              <span></span>
              <h5></h5>
              <div className="star">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <h4>$78</h4>
            </div>
            <a href="/valid-url"><i className="fal fa-shopping-cart cart"></i></a>
          </div>
          {/* ...other products... */}
        </div>
      </section>

      <section id="banner" className="section-m1">
        <h4></h4>
        <h2>Up to <span>70% off</span> </h2>
        <button className="btn normal">Explore more</button>
      </section>

      <section id="product1" className="section-p1">
        <h2>New Arrivals</h2>
        <p></p>
        <div className="pro-container">
          <div className="pro">
            <img src="" alt="" />
            <div className="des">
              <span>adidas</span>
              <h5>Carton Astronault Tshirts</h5>
              <div className="star">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <h4>$78</h4>
            </div>
            <a href="/valid-url"><i className="fal fa-shopping-cart cart"></i></a>
          </div>
          {/* ...other products... */}
        </div>
      </section>

      <section id="sm-banner" className="section-p1">
        <div className="banner-box">
          <h4>crazy deals</h4>
          <h2>buy 1 get 1 free</h2>
          <span></span>
          <button className="btn white">Learn More</button>
        </div>
        <div className="banner-box banner-box2">
          <h4></h4>
          <h2>upcoming season</h2>
          <span></span>
          <button className="btn white">Collection</button>
        </div>
      </section>

      <section id="banner3" className="section-p1">
        <div className="banner-box">
          <h2>SEASONAL SALES</h2>
          <h3>Collection -50% OFF</h3>
        </div>
        <div className="banner-box banner-img2">
          <h2>SEASONAL SALES</h2>
          <h3> Collection -50% OFF</h3>
        </div>
        <div className="banner-box banner-img3">
          <h2>SEASONAL SALES</h2>
          <h3></h3>
        </div>
      </section>

      <section id="newsletter" className="section-p1">
        <div className="newstext">
          <h4>Sign Up for Newsletters</h4>
          <p>Get Email updates about our latest shop and <span>special offers.</span></p>
        </div>
        <div className="form">
          <input type="text" placeholder="Your email address" />
          <button className="btn normal">Sign Up</button>
        </div>
      </section>

      <footer className="section-p1">
        <div className="col">
          <a href="/valid-url"><img className="logo" src="" alt="logo" /></a>
          <h4>Contact</h4>
          <p><strong>Address:</strong> 349, Olorilogbon street, Onigbogbo Lagos</p>
          <p><strong>Phone:</strong> +23456876199, +23458903120</p>
          <p><strong>Hours:</strong> 10.00 - 18.00, Mon - Sat</p>
          <div className="follow">
            <h4>Follow Us</h4>
            <div className="icon">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-youtube"></i>
              <i className="fab fa-pinterest-p"></i>
            </div>
          </div>
        </div>
        <div className="sec">
          <div className="col">
            <h4>About</h4>
            <a href="/valid-url">About Us</a>
            <a href="/valid-url">Delivery Information</a>
            <a href="/valid-url">Privacy Policy</a>
            <a href="/valid-url">Terms and Condition</a>
            <a href="/valid-url">Contact Us</a>
          </div>
          <div className="col">
            <h4>My Account</h4>
            <a href="/valid-url">Sign In</a>
            <a href="/valid-url">View Cart</a>
            <a href="/valid-url">My Account</a>
            <a href="/valid-url">My Wishlist</a>
            <a href="/valid-url">Track my Order</a>
            <a href="/valid-url">Help</a>
          </div>
          <div className="col install">
            <h4>Install App</h4>
            <p>From App Store or Google Play</p>
            <div className="row">
              <img src="https://i.postimg.cc/Y2s5mLdR/app.jpg" alt="" />
              <img src="https://i.postimg.cc/7YvyWTS6/play.jpg" alt="" />
            </div>
            <p>Secured Payment Gateways</p>
            <img src="https://i.postimg.cc/kgfzqVRW/pay.png" alt="" />
          </div>
        </div>
        <div className="coypright">
          <p>© 2023 All rights reserved! made by Tunrayo</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
