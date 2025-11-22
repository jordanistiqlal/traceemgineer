import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, usePage } from "@inertiajs/react";
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { handleRequestSubmit, handleRequestDelete } from '@/Utils/Request';
import Select from 'react-select';
import EditIcon from "@/Assets/icons/edit.svg"
import TrashIcon from "@/Assets/icons/trash.svg"

export default function Ticket({response = []}){
    const columns = [
        { key: 'number', label: 'No', sortable: false, searchable: false, render: (item, index) => index + 1, title: "Tickets"},
        { key: 'project.project_name', label: 'Project', sortable: true, searchable: true, render: (item) => item.project ? item.project.project_name : ''},
        { key: 'ticket_site', label: 'Site', sortable: true, searchable: true},
        { key: 'ticket_tanggal', label: 'Tanggal', sortable: true, searchable: true},
        { key: 'ticket_problem', label: 'Problem', sortable: true, searchable: true},
        { key: 'ticket_jam', label: 'Jam', sortable: true, searchable: true},
        { key: 'ticket_from', label: 'From', sortable: true, searchable: true},
        { key: 'bodyraw', label: 'bodyRaw', sortable: true, searchable: true, render: (item) => item.bodyraw.length > 30 ? item.bodyraw.substring(0, 30) + "..." : item.bodyraw},
        { key: 'action', label: 'Action', align: 'center', sortable: false, searchable: false,
            render: (item) => (
                <div className="flex justify-center gap-2">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                        title="Edit"
                        data-ticket={JSON.stringify(item)}
                        onClick={(e) => onEdit(e)}
                    >
                        <img src={EditIcon} title='Edit' alt="edit-picture"/>
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                        title="Delete"
                        onClick={() => onDelete(item.ticket_id)}
                    >
                        <img src={TrashIcon} title='delete' alt="trash-picture"/>
                    </button>
                </div>
        )}
    ]

    const { props } = usePage();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [FormVisible, setFormVisible] = useState(false)
    const {data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        id:"",
        site:"",
        tanggal: "",
        jam: "",
        created: props.auth.user.user_id,
        problem:"",
        project:"",
        bodyraw:"",
    })
    const dataTable = response?.data || []
    const projectSelection = response?.selection?.projects || []
    

    const ToogleForm = () => {
        reset();
        setSelectedDate(null);
        setSelectedTime(null);
        
        if(FormVisible){
            return setFormVisible(false)
        }
        return setFormVisible(true)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()

        handleRequestSubmit(e, data, post, put, reset, 'ticket', ToogleForm);

        setSelectedDate(null);
        setSelectedTime(null);
    }

    const onEdit = (e) => {
        e.preventDefault()
        ToogleForm();

        const response = (e.currentTarget.dataset.ticket) ? JSON.parse(e.currentTarget.dataset.ticket) : null;
        if(!response) return;

        setData({
            id: response.ticket_id || "",
            site: response.ticket_site || "",
            tanggal: response.ticket_tanggal || "",
            jam: response.ticket_jam || "",
            created: response.ticket_from || "",
            problem: response.ticket_problem || "",
            bodyraw: response.bodyraw || "",
            project: response.project_id || ""
        });
        setSelectedDate(new Date(response.ticket_tanggal))
        
        const jamFix = response.ticket_jam ? response.ticket_jam.replace('.', ':') : null;
        setSelectedTime( jamFix ? new Date(`1970-01-01T${jamFix}:00`) : null );
    }

    const onDelete = (id) => {
        handleRequestDelete(id, destroy, 'ticket');
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
            <Head title='Ticket Data'></Head>
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
                        data={dataTable || []}
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
                            <h2 className="text-2xl mb-6 text-gray-700 uppercase font-sans font-bold">Form Ticket</h2>
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
                                <label htmlFor="project" className="w-55 text-sm font-medium text-gray-700" > Project </label> 
                                <div className="flex-1 flex flex-col">
                                    <Select
                                        id="project" name="project" placeholder="Select Project"
                                        value={projectSelection.find(option => option.value === data.project) || null}
                                        onChange={(selectedOption) => setData('project', selectedOption?.value || '')}
                                        options={projectSelection}
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
                            
                            <div className="p-2 flex items-center"> 
                                <label htmlFor="site" className="w-55 text-sm font-medium text-gray-700" >Site</label> 
                                <div className="flex-1 flex flex-col">
                                    <input type="text" name="site" id="site" placeholder="Site" className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.site} onChange={(e) => setData('site', e.target.value)}/>
                                    {errors.site && <span className="text-red-500 text-sm">{errors.site}</span>}
                                </div>
                            </div>
        
                            <div className="p-2 flex items-center"> 
                                <label htmlFor="tanggal" className="w-55 text-sm font-medium text-gray-700" >Tanggal</label> 
                                <div className="flex-1 flex flex-col">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date)
                                            setData('tanggal', date ? new Date(date).toISOString().split("T")[0] : '');
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="0000-00-00"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                        id="tanggal"
                                        name="tanggal"
                                        popperPlacement="bottom-start"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        yearDropdownItemNumber={50}
                                        scrollableYearDropdown
                                    />
                                    {errors.tanggal && <span className="text-red-500 text-sm">{errors.tanggal}</span>}
                                </div>
                            </div>
        
                            <div className="p-2 flex items-center"> 
                                <label htmlFor="jam" className="w-55 text-sm font-medium text-gray-700" >Jam</label> 
                                <div className="flex-1 flex flex-col">
                                    <DatePicker
                                        selected={selectedTime}
                                        onChange={(time) => {
                                            setSelectedTime(time)
                                            setData('jam', time ? time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'}) : '');
                                        }}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Waktu"
                                        dateFormat="HH:mm:ss"
                                        placeholderText="00:00:00"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                        id="jam"
                                        name="jam"
                                        popperPlacement="bottom-start"
                                    />
                                    {errors.jam && <span className="text-red-500 text-sm">{errors.jam}</span>}
                                </div>
                            </div>
        
                            <div className="p-2 flex items-center"> 
                                <label htmlFor="userInput" className="w-55 text-sm font-medium text-gray-700" >Dibuat Oleh</label> 
                                <div className="flex-1 flex flex-col">
                                    <input type="text" name="userInput" id="userInput" placeholder="ADMIN" value={props.auth.user.username} className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200" disabled={true}/>
                                    <span className="text-gray-500 text-sm">Auto from user auth</span>
                                    {errors.userInput && <span className="text-red-500 text-sm">{errors.userInput}</span>}
                                </div>
                            </div>
        
                            <div className="p-2 flex items-center"> 
                                <label htmlFor="problem" className="w-55 text-sm font-medium text-gray-700" >Problem</label> 
                                <div className="flex-1 flex flex-col">
                                    <input name="problem" id="problem" placeholder="problem..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.problem} onChange={(e) => setData('problem', e.target.value)}/>
                                    {errors.problem && <span className="text-red-500 text-sm">{errors.problem}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="bodyraw" className="w-55 text-sm font-medium text-gray-700" >BodyRaw</label> 
                                <div className="flex-1 flex flex-col">
                                    <textarea name="bodyraw" id="bodyraw" placeholder="bodyRaw..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.bodyraw} onChange={(e) => setData('bodyraw', e.target.value)}/>
                                    {errors.bodyraw && <span className="text-red-500 text-sm">{errors.bodyraw}</span>}
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

Ticket.layout = page => <MainLayout children={page} sidebarData={[]} />;