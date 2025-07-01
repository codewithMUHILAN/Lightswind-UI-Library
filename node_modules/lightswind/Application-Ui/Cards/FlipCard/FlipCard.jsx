import React from "react";

const FlipCard = () => {
  return (

    <div className="w-full sm:w-[300px] md:w-[250px] mx-auto text-white">
      <div className="container-flipcardlw ">
        <div className="front-flipcardlw shadow-lg pt-[45%]"
          style={{ backgroundImage: "url(https://images.pexels.com/photos/28749618/pexels-photo-28749618/free-photo-of-majestic-view-of-the-taj-mahal-in-agra.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)" }}>
          <div className="inner-flipcardlw">
            <p className="relative botom-20 text-lg">INDIA</p>
            <span className="span-flipcardlw text-gray-300">Taj Mahal</span>
          </div>
        </div>
        <div className="back-flipcardlw shadow-lg pt-[45%]">
          <div className="inner-flipcardlw">
            <p className="relative botom-20 text-lg">Taj Mahal is a beautiful and most attractive historical place
              in India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
