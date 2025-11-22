import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from 'react';
import Plus from '@/Components/Plus';
import Table from '@/Components/Table';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Type } from '@/Config/typeConfig';

export default function Instalasi({response=[]}){
    const columns = [
        { key: 'number', label: 'No', sortable: false, searchable: false, render: (item, index) => index + 1, title: "Engineer Data"},
        { key: 'task_name', label: 'Nama Engineer', sortable: true, searchable: true, render: (item) => item.task_name || '-' },
        { key: 'user.name', label: 'Nama Engineer', sortable: true, searchable: true, render: (item) => item.user?.name || '-' },
        { key: 'user.nohp', label: 'Nomor Phone', sortable: true, searchable: true, render: (item) => item.user?.nohp || '-' },
        { key: 'user.email', label: 'Email', sortable: true, searchable: true, render: (item) => item.user?.email || '-' },
    ];
    const {data, setData, post, processing, reset, errors, clearErrors } = useForm({ nama_project:"", tipe:""})
    const [projectTitle, setprojectTitle] = useState("")
    const [FormVisible, setFormVisible] = useState(true)

    const toogleSection = () => {
        reset()
        if(FormVisible){return setFormVisible(false)}
        return setFormVisible(true)
    }
    const projectData = response.projects || []
    const [detailProjectData, setdetailProjectData] = useState([])

    const ProjectShow = (e) => {
        e.preventDefault()
        setFormVisible(true)
        setprojectTitle(e.currentTarget.dataset.title)
        showDetail(e.currentTarget.dataset.id)
    }

    const showDetail = async (id) => {
        try {
            const res = await fetch(route('task.show', id));
            if (!res.ok) throw await res.text();

            const data = await res.json();
            
            setdetailProjectData(data.task);

        } catch (error) {
            Swal.fire({
                text: error || 'Something went wrong',
                icon: "error",
                title: "Oops...",
                confirmButtonText: 'Close'
            });
        }
    };


    const handleSubmit = (e) =>{
        e.preventDefault()

        try {
            post(route('project.store'), {
                onSuccess: () =>{
                    Swal.fire({
                        title: "Created Succesfully",
                        icon: "success",
                        draggable: true
                    });

                    reset()
                },
                onError: (errors) =>{
                    const errorMessages = typeof errors != 'object' ? errors : Object.values(errors).flat().join('\n');
                    
                    Swal.fire({
                        text: errorMessages,
                        icon: "error",
                        title: "Oops...",
                        confirmButtonText: 'Close'
                    })
                }
            })
        } catch (error) {
            Swal.fire({
                text: error,
                icon: "error",
                title: "Oops...",
            })
        }
    }

    useEffect(() =>{
        const hasErrors = Object.keys(errors).length > 0;
        
        if(hasErrors){
            setTimeout(() => {
                clearErrors();
            }, 5000);
        }
        
    }, [errors])

    return(
        <>
            <Head title='Instalasi'></Head>

            <div className="grid grid-cols-4">
                <div className="">
                    <div className="flex flex-col flex-1 gap-2 mb-5 p-3 max-h-max h-[45vh] overflow-y-auto scrollbar-hide">
                        {projectData.map((item,i) => (
                            <Link key={i} data-title={(item.project_name).toUpperCase()} data-id={item.project_id} className="bg-[#9AB78F] rounded-2xl px-6 py-3 w-full uppercase text-md font-bold text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50" onClick={ProjectShow}>
                                {item.project_name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-start w-full px-2 mt-5">
                        <button type="button" onClick={() => setFormVisible(false)} className="w-12 h-12 rounded-full text-xl font-extrabold shadow-2xl transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-black text-white hover:bg-gray-700 ring-4 hover:ring-gray-400/50 p-2"> <Plus/> </button>
                        <p className='text-sm px-5 mt-2 font-extrabold md:text-md lg:text-2xl whitespace-nowrap'> Add Project </p>
                    </div>
                </div>

                <div className='col-span-3 pl-5 '>

                    <div className={`${FormVisible && projectTitle != "" ? '' : 'hidden'} `}>
                        <h1 className='text-4xl font-bold mb-5'>{projectTitle}</h1>
                        <Table 
                            data={detailProjectData}
                            columns={columns}
                            search={true}
                            sort={true}
                            pagination={true}
                            perPage={5}
                            perPageOptions={[5, 10, 25, 50, 100]}
                            searchPlaceholder="Search name or else..."
                            emptyMessage="No data available"
                        />
                    </div>

                    <div className={`${FormVisible ? 'hidden': ''}`}>
                        <h1 className='text-4xl font-bold mb-5'> Add Project</h1>
                        <form className='w-full'>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="nama_project" className="w-55 text-sm font-medium text-gray-700" >Nama</label> 
                                <div className="flex-1 flex flex-col">
                                    <input type="text" name="nama_project" id="nama_project" placeholder="Project Name" className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.nama_project} onChange={(e) => setData('nama_project', e.target.value)}/>
                                    {errors.nama_project && <span className="text-red-500 text-sm">{errors.nama_project}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="tipe" className="w-55 text-sm font-medium text-gray-700" >Tipe</label> 
                                <div className="flex-1 flex flex-col">
                                    {/* <input type="text" name="tipe" id="tipe" placeholder="Tipe" className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/> */}
                                    <Select
                                        id="tipe" name="tipe" placeholder="Select Tipe"
                                        value={Type.find(option => option.value === data.tipe) || null}
                                        onChange={(selectedOption) => setData('tipe', selectedOption?.value || '')}
                                        options={Type}
                                        className="flex-1"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderColor: '#d1d5db',
                                                boxShadow: 'none',
                                                '&:hover': { borderColor: '#d1d5db' }
                                            })
                                        }}
                                    />
                                    {errors.tipe && <span className="text-red-500 text-sm">{errors.tipe}</span>}
                                </div>
                            </div>

                            <div className="flex items-end justify-end mt-10">
                                <button type="submit" onClick={handleSubmit} className="w-[10%] h-10 rounded-4xl text-lg font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-[#9AB78F] text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50">
                                    <span className="">
                                        {processing ? 'Loading...' : 'Add'}
                                    </span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

Instalasi.layout = page => <MainLayout children={page} sidebarData={[]} />;