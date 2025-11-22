import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from "@inertiajs/react";
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { handleRequestSubmit, handleRequestDelete } from '@/Utils/Request';
import EditIcon from "@/Assets/icons/edit.svg"
import TrashIcon from "@/Assets/icons/trash.svg"

import { Type } from '@/Config/typeConfig';

export default function Task({response = []}){
    const columns = [
        { key: 'number', label: 'No', sortable: false, searchable: false, render: (item, index) => index + 1, title: "Tasks"},
        // { key: 'task_id', label: 'Id', sortable: true, searchable: true},
        { key: 'task_name', label: 'Nama Task', sortable: true, searchable: true},
        { key: 'task_type', label: 'Tipe', sortable: true, searchable: true},
        { key: 'project.project_name', label: 'Project', sortable: true, searchable: true, render: (item) => item.project ? item.project.project_name : ''},
        { key: 'user.name', label: 'Engineer', sortable: true, searchable: true, render: (item) => item.user ? item.user.name : ''},
        { key: 'action', label: 'Action', align: 'center', sortable: false, searchable: false,
            render: (item) => (
                <div className="flex justify-center gap-2">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                        title="Edit"
                        data-task={JSON.stringify(item)}
                        onClick={(e) => onEdit(e)}
                    >
                        <img src={EditIcon} title='Edit' alt="edit-picture"/>
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                        title="Delete"
                        onClick={() => onDelete(item.task_id)}
                    >
                        <img src={TrashIcon} title='delete' alt="trash-picture"/>
                    </button>
                </div>
        )}
    ]

    const {data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        id:"",
        name:"",
        tipe:"",
        project:"",
        engineer:"",
    })
    const [FormVisible, setFormVisible] = useState(false)
    const dataResponse = response.data || []
    const engineers = response.engineers || []
    const projects = response.projects || []

    console.log(dataResponse);
    

    const ToogleForm = () => {
        reset();
        if(FormVisible){
            return setFormVisible(false)
        }
        return setFormVisible(true)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()

        handleRequestSubmit(e, data, post, put, reset, 'task', ToogleForm);
    }

    const onEdit = (e) => {
        e.preventDefault()
        ToogleForm();

        const response = (e.currentTarget.dataset.task) ? JSON.parse(e.currentTarget.dataset.task) : null;
        if(!response) return
        
        setData({
            id: response.task_id || "",
            name: response.task_name || "",
            tipe: response.task_type || "",
            project: response.project_id || "",
            engineer: response.user_id || ""
        });
    }

    const onDelete = (id) => {
        handleRequestDelete(id, destroy, 'task');
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
            <Head title='Task Data'></Head>
            <div className={`${FormVisible ? 'hidden' : ''}`}>
                <div className="flex justify-end w-full px-6 py-2">
                    <button type="submit" onClick={ToogleForm} className="w-25 h-11 rounded-4xl text-xl font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-[#9AB78F] text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50">
                        <span className="drop-shadow-md px-2 ">
                            Create
                        </span>
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-800/20 p-6 overflow-x-auto">
                    <Table 
                        data={dataResponse || []}
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
            </div>

            <div className={`${FormVisible ? '' : 'hidden'}`}>
                <div className="flex justify-start w-full px-6 py-2">
                    <button type="button" onClick={ToogleForm} className="w-[10%] h-10 rounded-4xl text-xl font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-black text-white hover:bg-gray-700 ring-4 hover:ring-gray-400/50">Back</button>
                </div>
                <div className='px-6'>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-800/20 p-6 overflow-x-auto">
                        <div className="flex w-full justify-center items-center">
                            <h2 className="text-2xl mb-6 text-gray-700 uppercase font-sans font-bold">Form Project</h2>
                        </div>
                    
                    <form onSubmit={handleSubmit} id="form" className="p-4">

                        <div className="p-2 items-center hidden"> 
                            <label htmlFor="id" className="w-55 text-sm font-medium text-gray-700" >id</label> 
                            <div className="flex-1 flex flex-col">
                                <input type="text" name="id" id="id" placeholder="id" className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.id} onChange={(e) => setData('id', e.target.value)}/>
                                {errors.id && <span className="text-red-500 text-sm">{errors.id}</span>}
                            </div>
                        </div>

                        <div className="p-2 flex items-center"> 
                            <label htmlFor="name" className="w-55 text-sm font-medium text-gray-700" > Nama Task </label> 
                            <div className="flex-1 flex flex-col">
                                <input type="text" name="name" id="name" placeholder="Task Name" className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.name} onChange={(e) => setData('name', e.target.value)}/>
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>
                        </div>
                                
                        {/* Task Input */}
                        <div className="p-2 flex items-center"> 
                            <label htmlFor="tipe" className="w-55 text-sm font-medium text-gray-700" > Tipe Task </label> 
                            <div className="flex-1 flex flex-col">
                            <Select
                                id="tipe" name="tipe" placeholder="Select Task"
                                value={Type.find(option => option.value === data.tipe) || ''}
                                onChange={(selectedOption) => setData('tipe', selectedOption?.value || '')}
                                options={Type}
                                className="flex-1"
                                isDisabled={true}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: '#d1d5db',
                                        boxShadow: 'none',
                                        '&:hover': { borderColor: '#d1d5db' }
                                    })
                                }}
                            />
                            {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
                            </div>
                        </div>

                        {/* Project Input */}
                        <div className="p-2 flex items-center"> 
                            <label htmlFor="project" className="w-55 text-sm font-medium text-gray-700" > Project </label> 
                            <div className="flex-1 flex flex-col">
                                <Select
                                    id="project" name="project" placeholder="Select Project"
                                    value={projects.find(option => option.value === data.project) || ''}
                                    onChange={(selectedOption) => {
                                        setData('project', selectedOption?.value || '')
                                        setData('tipe', selectedOption?.type || '')
                                    }}
                                    options={projects}
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
                                {errors.project && <span className="text-red-500 text-sm">{errors.project}</span>}
                            </div>
                        </div>
                        
                        {/* Engineer Input */}
                        <div className="p-2 flex items-center"> 
                            <label htmlFor="engineer" className="w-55 text-sm font-medium text-gray-700" > Engineer </label> 
                            <div className="flex-1 flex flex-col">
                                <Select
                                    id="engineer" name="engineer" placeholder="Select Engineer"
                                    value={engineers.find(option => option.value === data.engineer) || ''}
                                    onChange={(selectedOption) => setData('engineer', selectedOption?.value || '')}
                                    options={engineers}
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
                                {errors.engineer && <span className="text-red-500 text-sm">{errors.engineer}</span>}
                            </div>
                        </div>


                        <div className="flex justify-end w-full p-2 pt-10">
                            <button type="submit" disabled={processing} className="w-[20%] h-12 rounded-lg text-xl font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-[#9AB78F] text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50">
                                <span className="drop-shadow-md">
                                    {processing ? 'Loading...' : 'Sumbit'}
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

Task.layout = page => <MainLayout children={page} sidebarData={[]} />;