import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from "@inertiajs/react";
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { formatPhone } from '@/Utils/Function';
import { handleRequestSubmit, handleRequestDelete } from '@/Utils/Request';
import EditIcon from "@/Assets/icons/edit.svg"
import TrashIcon from "@/Assets/icons/trash.svg"

const RoleOptions = [
    { value: 'ENGINEER', label: 'ENGINEER' },
    { value: 'ADMIN', label: 'ADMIN' }
];

export default function User({response = []}){
    const columns = [
        { key: 'number', label: 'No', sortable: false, searchable: false, render: (item, index) => index + 1, title: "Users"},
        { key: 'user_id', label: 'Id', sortable: true, searchable: true},
        { key: 'name', label: 'Name', sortable: true, searchable: true},
        { key: 'username', label: 'Username', sortable: true, searchable: true},
        { key: 'email', label: 'Email', sortable: true, searchable: true},
        { key: 'nohp', label: 'No.Handphone', sortable: false, searchable: true},
        { key: 'action', label: 'Action', align: 'center', sortable: false, searchable: false,
            render: (item) => (
                    <div className="flex justify-center gap-2">
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                            title="Edit"
                            data-user={JSON.stringify(item)}
                            onClick={(e) => onEdit(e)}
                        >
                            <img src={EditIcon} title='Edit' alt="edit-picture"/>
                        </button>
                        <button 
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                            title="Delete"
                            onClick={() => onDelete(item.user_id)}
                        >
                            <img src={TrashIcon} title='delete' alt="trash-picture"/>
                        </button>
                    </div>
            )}
    ];

    const {data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        id:"",
        name:"",
        username:"",
        email:"",
        nohp:"",
        password:"",
        role:""
    })
    const [FormVisible, setFormVisible] = useState(false)

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setData((prev) => ({ ...prev, nohp: formatted }));
    };

    const handleSubmit = (e) =>{
        e.preventDefault()
        handleRequestSubmit(e, data, post, put, reset, 'user', ToogleForm);
    }

    const onEdit = (e) => {
        e.preventDefault()
        ToogleForm();

        const response = (e.currentTarget.dataset.user) ? JSON.parse(e.currentTarget.dataset.user) : null;
        if(!response) return;
        
        setData({
            id: response.user_id || "",
            name: response.name || "",
            username: response.username || "",
            email: response.email || "",
            nohp: response.nohp || "",
            password: "",
            role: response.role || ""
        });
    }

    const onDelete = (id) => {
        handleRequestDelete(id, destroy, 'user');
    }

    const ToogleForm = () => {
        reset();
        if(FormVisible){
            return setFormVisible(false)
        }
        return setFormVisible(true)
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
            <Head title='User Data'></Head>
            <div className={`${FormVisible ? 'hidden' : ''}`}>
                <div className="flex justify-end w-full px-6 py-2">
                    <button type="submit" onClick={ToogleForm} className="w-25 h-11 rounded-4xl text-xl font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-[#9AB78F] text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50">
                        <span className="drop-shadow-md px-2 ">
                            Create
                        </span>
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-800/20 p-6 max-h-max h-[90vh] overflow-y-auto">
                    <Table 
                        data={response || []}
                        columns={columns}
                        search={true}
                        sort={true}
                        pagination={true}
                        perPage={5}
                        perPageOptions={[5, 10, 25, 50, 100]}
                        searchPlaceholder="Search name or email..."
                        emptyMessage="No users available"
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
                            <h2 className="text-2xl mb-6 text-gray-700 uppercase font-sans font-bold">Form User</h2>
                        </div>
                    
                        <form onSubmit={handleSubmit} id="form" className="p-4">
                            <div className="p-2 hidden">
                                <label htmlFor="id" className="block text-sm font-medium text-gray-700">Id</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="id" name="id" id="id" placeholder="ENG328F" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.id} onChange={(e) => setData('id', e.target.value)}/>

                                    {errors.id && <span className="text-red-500 text-sm">{errors.id}</span>}
                                </div>
                            </div>

                            <div className="p-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="name" name="name" id="name" placeholder="John Doe" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.name} onChange={(e) => setData('name', e.target.value)}/>

                                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                </div>
                            </div>

                            <div className="p-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="username" name="username" id="username" placeholder="Joko" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.username} onChange={(e) => setData('username', e.target.value)}/>

                                    {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                                </div>
                            </div>

                            <div className="p-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="email" name="email" id="email" placeholder="johndoe@gmail.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.email} onChange={(e) => setData('email', e.target.value)}/>

                                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2">
                                <div className="p-2">
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                    <div className="flex-1 flex flex-col">
                                        <Select
                                            id="role" name="role" placeholder="Select Role"
                                            // value={RoleOptions.find(option => option.value === data.name)}
                                            value={RoleOptions.find(option => option.value === data.role) || null}
                                            onChange={(selectedOption) => setData('role', selectedOption?.value || '')}
                                            options={RoleOptions}
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
                                        {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                                    </div>
                                </div>

                                <div className="p-2">
                                    <label htmlFor="nohp" className="w-55 text-sm font-medium text-gray-700" > No Handphone </label>

                                    <div className="flex-1 flex flex-col">
                                        <input type="text" name="nohp" id="nohp" placeholder="0000-0000-0000"className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handlePhoneChange} onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") e.preventDefault(); }} value={data.nohp} />
                                        {errors.nohp && <span className="text-red-500 text-sm">{errors.nohp}</span>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="password" name="password" id="password" placeholder="⦁⦁⦁⦁⦁" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.password} onChange={(e) => setData('password', e.target.value)}/>

                                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
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

User.layout = page => <MainLayout children={page} sidebarData={[]} />;