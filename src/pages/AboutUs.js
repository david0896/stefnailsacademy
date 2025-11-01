import { FaHandSparkles, FaHandPaper, FaPalette, FaGem } from 'react-icons/fa';
import { GiNailedFoot, GiNails } from "react-icons/gi";
import HeroAboutUs from '@/components/aboutUs/HeroAboutUs'
import BlurImage from "@/components/BlurImage";

const AboutUs = () => {
  return (
    <div className=''>
        <HeroAboutUs/>
        <div className="h-40 flex flex-col lg:flex-row gap-3 -mt-[15vw] lg:-mt-20 w-9/12 mx-auto justify-center items-center relative">
          <img src="https://i.postimg.cc/9Q3JyTk9/charla-de-entrega-de-diplomas-stef-nails-academia.png" alt="Stef Nails academia" className=" w-60 h-44 hidden lg:block rounded-md aspect-square object-cover"/>
          <img src="https://i.postimg.cc/VLsbpNbh/certificado-curso-stef-nails.png" alt="Stef Nails academia" className="w-52 h-36 rounded-md hidden lg:block aspect-square object-cover"/>
          <div className="flex space-x-4">
            <img src="https://i.postimg.cc/X79DHQdL/entrega-de-certificado-stef-nails-academia.png" alt="Stef Nails academia" className="w-52 h-36 lg:w-56 lg:h-40 rounded-md aspect-square object-cover"/>
            <img src="https://i.postimg.cc/3rvLNnSh/entre-de-medalla-stef-nails-academia.png" alt="Stef Nails academia" className=" w-52 h-36 rounded-md aspect-square object-cover"/>
          </div>
        </div>
        <div className="w-9/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-10 lg:pt-20 pb-10 lg:gap-5">
            <div className="col-span-2 lg:w-7/12">
              <h2 className="text-[#ff5a5f] text-2xl xl:text-3xl font-semibold mb-3">Convertimos tu pasión en una carrera profesional real</h2>
              <p className='lg:text-lg'>Desde hace más de 13 años, formando técnicos y líderes en la industria del Nail Art en Venezuela y Latinoamérica</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 pb-10 gap-5">
            <div className="col-span-1">
              <p className="text-[#383838] lg:text-lg">
              Comenzamos hace 13 años con un sueño: lograr independencia y brindar educación a mi hija. Iniciamos en un pequeño espacio en la estación de Artigas, ofreciendo clases en condiciones precarias. Tres años después, tuvimos que decidir entre atender clientas o enfocarnos en formar profesionales... Apostamos por la educación
              </p>
            </div>
            <div className="col-span-1">
              <p className="text-[#383838] lg:text-lg">
              Desde entonces, nos trasladamos al C.C. Galerías Paraíso, ampliando espacios y formando técnicos iniciales, técnicos profesionales, master de salón y master duales. Hoy, proyectamos academias en todo el país y presencia en Latinoamérica
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 pb-10 lg:gap-5">
            <div className="col-span-1">
              <BlurImage
                  lowQualitySrc="https://i.postimg.cc/QC7TBQTm/Stef-Nails-blur.jpg"
                  fullQualitySrc="https://i.postimg.cc/kMR8hmpS/Stef-Nails.jpg"
                  alt="Instructora profesional Stef"
                  className={"w-10/12 h-auto lg:h-[25vw] rounded-md aspect-square object-cover"}
              />
            </div>
            <div className="col-span-1 mt-10 space-y-5 flex flex-col ">
              <h3 className="text-[#ff5a5f] text-2xl font-semibold lg:w-7/12">Más de 10.000 egresados, formando líderes cada año</h3>
              <p className="text-[#383838] lg:text-lg">Formamos más de 1.500 estudiantes al año, con más de 10.000 egresados aproximadamente. Nuestra comunidad de egresadas lidera salones, academias y negocios en todo el país</p>
              <p className="text-[#383838] lg:text-lg border-l-4 border-[#ff5a5f] p-2 italic bg-gray-50">"Cada alumna es una historia de éxito, independencia y empoderamiento"</p>
          </div>
            
          </div>
        </div>
        <div className="w-9/12 mx-auto">
          <div className="col-span-2 lg:text-center flex flex-col justify-center lg:w-7/12 mb-10 mx-auto space-y-4">
              <h2 className="text-[#ff5a5f] text-2xl xl:text-3xl font-semibold">Formadas por los mejores, reconocidas por los grandes</h2>
              <p className="lg:text-lg text-[#383838] mx-auto lg:mx-0 ">Somos Master Instructores certificados y avalados por las marcas más importantes de la industria a nivel nacional e internacional: TONES, ANTARTYC, STALEKS, MIX COCO, SUPERCRISTAL, LATIN NAILS, NAILSHOP, JUDA, CANNI, LIAN</p> 
              <p className="lg:text-lg text-[#383838] mx-auto lg:mx-0">Formadas por los mejores instructores europeos, seguimos los lineamientos de los más exigentes estándares internacionales</p>
          </div>
        </div>
        <div className="w-9/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 text-center pb-20 gap-5">
            <div className=" flex flex-col justify-center items-center space-y-3">
              <FaHandPaper className=" text-3xl"/>
              <h3 className="text-[#ff5a5f] text-2xl font-semibold ">Misión</h3>
              <p className="text-[#383838] lg:text-lg">Empoderar a nuestras estudiantes con habilidades y conocimientos de excelencia para que destaquen como técnicas, educadoras o emprendedoras</p> 
            </div>
            <div className="flex flex-col justify-center items-center space-y-3">
              <FaGem className=" text-3xl"/>
              <h3 className="text-[#ff5a5f] text-2xl font-semibold ">Valores</h3>
              <p className="text-[#383838] lg:text-lg">Creatividad, profesionalismo, pasión por el arte, excelencia educativa, actualización constante y visión internacional</p> 
            </div>
            <div className="flex flex-col justify-center items-center space-y-3">
              <FaPalette className=" text-3xl"/>
              <h3 className="text-[#ff5a5f] text-2xl font-semibold ">Enfoque educativo</h3>
              <p className="text-[#383838] lg:text-lg">Metodología práctica, personalizada, con atención individualizada y alineada a las últimas tendencias internacionales del Nail Art</p> 
            </div>
          </div>
        </div>
    </div>
  )
}

export default AboutUs