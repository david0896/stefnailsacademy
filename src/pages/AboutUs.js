import { FaHandSparkles, FaHandPaper, FaPalette, FaGem } from 'react-icons/fa';
import { GiNailedFoot, GiNails } from "react-icons/gi";
import HeroAboutUs from '@/components/aboutUs/HeroAboutUs'

const AboutUs = () => {
  return (
    <div className=''>
        <HeroAboutUs/>
        <div className="h-40 flex flex-row gap-3 -mt-20 w-9/12 mx-auto justify-center items-center relative">
          <img src="https://i.postimg.cc/9Q3JyTk9/charla-de-entrega-de-diplomas-stef-nails-academia.png" alt="Stef Nails academia" className=" w-60 h-44 rounded-md"/>
          <img src="https://i.postimg.cc/VLsbpNbh/certificado-curso-stef-nails.png" alt="Stef Nails academia" className="w-52 h-36 rounded-md"/>
          <img src="https://i.postimg.cc/X79DHQdL/entrega-de-certificado-stef-nails-academia.png" alt="Stef Nails academia" className=" w-56 h-40 rounded-md"/>
          <img src="https://i.postimg.cc/3rvLNnSh/entre-de-medalla-stef-nails-academia.png" alt="Stef Nails academia" className=" w-52 h-36 rounded-md"/>
        </div>
        <div className="w-9/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-20 pb-10 gap-5">
            <div className="col-span-2">
              <h2 className="text-[#ff5a5f] text-4xl font-semibold w-8/12 mb-3">We make sure yout idea and creation delivered properly</h2>
            </div>
            <div className="col-span-1">
              <p className="text-[#383838]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet
              </p>
            </div>
            <div className="col-span-1">
              <p className="text-[#383838]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet
              </p>
            </div>
            <div className="col-span-1 mt-10">
              <img src="https://i.postimg.cc/1XwMd3nX/estefanie-instructora-stef-nails-academia.png" alt="Stef Nails academia" className=" w-10/12 h-[25vw] rounded-md"/>    
            </div>
            <div className="col-span-1 mt-10 space-y-5 flex flex-col justify-center">
              <h3 className="text-[#ff5a5f] text-2xl font-semibold ">We empower small business owners</h3>
              <p className="text-[#383838]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet</p>
              <p className="text-[#383838] border-l-4 border-[#ff5a5f] p-2 italic ml-2">
              "consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet"
              </p>
            </div>
            <div className="col-span-2 mt-10 text-center flex flex-col justify-center w-7/12 mx-auto">
              <h2 className="text-[#ff5a5f] text-4xl font-semibold mb-3">We make sure yout idea and creation delivered properly</h2>
              <p className="text-lg text-[#383838] mx-auto lg:mx-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                  perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium.
              </p> 
            </div>
          </div>
        </div>
        <div className="w-9/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 text-center pb-20 gap-5">
            <div className=" flex flex-col justify-center items-center space-y-3">
              <FaHandSparkles className=" text-3xl"/>
              <h3 className="text-[#ff5a5f] text-2xl font-semibold ">We empower small business owners</h3>
              <p className="text-[#383838]">
              iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet
              </p> 
            </div>
            <div className="flex flex-col justify-center items-center space-y-3">
              <FaHandSparkles className=" text-3xl"/>
              <h3 className="text-[#ff5a5f] text-2xl font-semibold ">We empower small business owners</h3>
              <p className="text-[#383838]">
              iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet  
              </p> 
            </div>
            <div className="flex flex-col justify-center items-center space-y-3">
              <FaHandSparkles className=" text-3xl"/>
              <h3 className="text-[#ff5a5f] text-2xl font-semibold ">We empower small business owners</h3>
              <p className="text-[#383838]">
              iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium.Lorem ipsum dolor sit amet  
              </p> 
            </div>
          </div>
        </div>
    </div>
  )
}

export default AboutUs