import CarrucelCharacteristics from "@/components/courses/CarrucelCharacteristics"

const Courses = () => {
  return (
    <div className="w-10/12 mx-auto">
        <CarrucelCharacteristics/>
        <h2 className=" text-2xl font-bold text-[#383838] mt-10 mb-5">Conoce nuestro proximo curso ideal para ti</h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 border-[0.5px] border-gray-300 rounded-md p-8 gap-5 bg-[#ff5a600d]">
            <div className=" col-span-2" >
                <img
                    src="https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg"
                    alt="Ilustración de certificación"
                    className="w-full h-80 rounded-sm"
                />
            </div>
            <div className="col-span-3 space-y-5 flex flex-col justify-between">
                <div className="">
                    <h3 className="text-xl font-bold text-[#383838]">Curso: nombre del curso</h3>
                    <p className="text-[#383838] w-4/5">Descripcion del curso lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                        perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium.</p>
                    <p className="text-[#383838] text-sm"><span className=" font-semibold">Nombre del instructor:</span> nombre apellido</p>
                    <p className="text-[#383838]"><span className="text-[#ff5a5f] font-bold">12 de febrero del 2024</span> | 36 horas - 3 clases - nivel II</p>
                </div>
                <p className="text-[#383838] font-bold text-2xl">25,00 US$</p>
            </div>

        </div>
        <h2 className=" text-2xl font-bold text-[#383838] mt-10 mb-5">Conoce los siguientes cursos que tendremos para ti</h2>
        <div className="mb-10 grid grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="py-4">
                <img
                    src="https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg"
                    alt="Ilustración de certificación"
                    className="w-full h-auto rounded-sm mb-4"
                />
                <h3 className=" text-base font-bold text-[#383838]">Nombre del curso: especialidad</h3>
                <p className="text-[#383838] text-sm">Descripcion del curso lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                <p className="text-[#383838] text-sm"><span className=" font-semibold">Instructor:</span> nombre apellido</p>
                <p className="text-[#383838] text-sm"><span className="text-[#ff5a5f] font-bold block">12 feb 2024</span> 36 horas - 3 clases - nivel II</p>
            </div>
            <div className="py-4">
                <img
                    src="https://i.postimg.cc/TPxNkM3d/464022702-531428289646173-655186834931215605-n.jpg"
                    alt="Ilustración de certificación"
                    className="w-full h-auto rounded-sm mb-4"
                />
                <h3 className=" text-base font-bold text-[#383838]">Nombre del curso: especialidad</h3>
                <p className="text-[#383838] text-sm">Descripcion del curso lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                <p className="text-[#383838] text-sm"><span className=" font-semibold">Instructor:</span> nombre apellido</p>
                <p className="text-[#383838] text-sm"><span className="text-[#ff5a5f] font-bold block">12 feb 2024</span> 36 horas - 3 clases - nivel II</p>
            </div>
            <div className="py-4">
                <img
                    src="https://i.postimg.cc/KzzNVZS2/465433785-2803891859778406-3068294254290166738-n.jpg"
                    alt="Ilustración de certificación"
                    className="w-full h-auto rounded-sm mb-4"
                />
                <h3 className=" text-base font-bold text-[#383838]">Nombre del curso: especialidad</h3>
                <p className="text-[#383838] text-sm">Descripcion del curso lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                <p className="text-[#383838] text-sm"><span className=" font-semibold">Instructor:</span> nombre apellido</p>
                <p className="text-[#383838] text-sm"><span className="text-[#ff5a5f] font-bold block">12 feb 2024</span> 36 horas - 3 clases - nivel II</p>
            </div>
            <div className="py-4">
                <img
                    src="https://i.postimg.cc/JhQ6v6sb/460681804-1446786270045324-988062556002595548-n.jpg"
                    alt="Ilustración de certificación"
                    className="w-full h-auto rounded-sm mb-4"
                />
                <h3 className=" text-base font-bold text-[#383838]">Nombre del curso: especialidad</h3>
                <p className="text-[#383838] text-sm">Descripcion del curso lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                <p className="text-[#383838] text-sm"><span className=" font-semibold">Instructor:</span> nombre apellido</p>
                <p className="text-[#383838] text-sm"><span className="text-[#ff5a5f] font-bold block">12 feb 2024</span> 36 horas - 3 clases - nivel II</p>
            </div>
            <div className="py-4">
                <img
                    src="https://i.postimg.cc/y84Ld49m/465943319-920816589943776-7116630003229069637-n.jpg"
                    alt="Ilustración de certificación"
                    className="w-full h-auto rounded-sm mb-4"
                />
                <h3 className=" text-base font-bold text-[#383838]">Nombre del curso: especialidad</h3>
                <p className="text-[#383838] text-sm">Descripcion del curso lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                <p className="text-[#383838] text-sm"><span className=" font-semibold">Instructor:</span> nombre apellido</p>
                <p className="text-[#383838] text-sm"><span className="text-[#ff5a5f] font-bold block">12 feb 2024</span> 36 horas - 3 clases - nivel II</p>
            </div>
            
        </div>
    </div>
  )
}

export default Courses