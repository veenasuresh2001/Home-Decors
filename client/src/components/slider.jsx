import Carousel from 'react-bootstrap/Carousel';
import img1 from './images/section.avif';

function Slider() {
  return (
    <Carousel>
      <Carousel.Item>
        <img src={img1} alt="First slide" style={{width:'100%', height:'600px'}} />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      {/* Uncomment and add more items if needed */}
      {/* <Carousel.Item>
        <img src={img2} alt="Second slide" style={{width:'100%', height:'600px'}} />
        <Carousel.Caption>
          <b><h3 id='sliderhead2'>Discover Restaurants and your favourite tastes</h3></b>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={img3} alt="Third slide" style={{width:'100%', height:'600px'}} />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item> */}
    </Carousel>
  );
}

export default Slider;
