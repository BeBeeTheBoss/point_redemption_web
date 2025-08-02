import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Link, router } from "@inertiajs/react";
import { Breadcrumb, Button, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import dayjs from "dayjs";

export default function Histories() {

    const { url, props } = usePage();
    const urlSegments = url.split('/');
    let currentRoute;
    if (urlSegments.length === 2) {
        currentRoute = urlSegments[urlSegments.length - 1];
    } else if (urlSegments.length === 3) {
        currentRoute = urlSegments[1];
    }

    const [searchKey, setSearchKey] = useState('');
    const [businesses, setBusinesses] = useState(null);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewedBusiness, setViewedBusiness] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        business_id: ''
    });

    const [userEditForm, setUserEditForm] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
    });


    useEffect(() => {

        setBusinesses(props?.businesses);

        if (props?.flash.success) {
            toast.success(props?.flash.success);
        }
    }, [props]);

    const deleteBusiness = (id) => {
        router.delete('/businesses', { data: { id: id } });
        setBusinesses(businesses.filter(business => business.id !== id));
    }

    const handleSearch = () => {

        if (searchKey) {
            setBusinesses(props?.businesses?.filter(business =>
                business.name.toLowerCase().includes(searchKey.toLowerCase())
            ))
        } else {
            setBusinesses(props?.businesses);
        }

    }

    const addUser = () => {

        setLoading(true);

        router.post('/users', form, {
            onSuccess: (response) => {
                setIsAddUserDialogOpen(false);
                setLoading(false);
            },
            onError: (erros) => {
                setLoading(false);
                if (erros.name) {
                    toast.error(erros.name);
                }

                if (erros.email) {
                    toast.error(erros.email);
                }

                if (erros.password) {
                    toast.error(erros.password);
                }
            }
        })

    }

    const deleteUser = (id) => {
        {
            router.delete('/users', { data: { id: id } });
        }
    }

    const setUserData = (user) => {
        setIsEditUserDialogOpen(true);
        setUserEditForm({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '',
        });

    }

    const updateUser = () => {

        setLoading(true);

        router.post('/users/update', userEditForm, {
            onSuccess: (response) => {
                setLoading(false);
                setIsEditUserDialogOpen(false);
            },
            onError: (erros) => {

                setLoading(false);
                if (erros.name) {
                    toast.error(erros.name);
                }

                if (erros.email) {
                    toast.error(erros.email);
                }
            }
        })

    }

    return (
        <>
            <style>{`
                .inputBox{
                    width: 350px !important;
                    border-color: #00000042;
                    height: 44px;
                    border-radius: 5px;
                    outline: none !important;
                }
                .searchBox{
                    width: 200px !important;
                    border-color: #00000042;
                    margin: 10px 0;
                    height: 35px;
                    border-radius: 5px;
                    outline: none !important;
                }
                .bg-filter{
                    background-color: #000000ff;
                    color: white !important;
                }
            `}</style>
            <AuthenticatedLayout>
                <div className="mt-4 flex justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link className={`text-decoration-none ${currentRoute == 'businesses' ? 'text-black' : ''}`} href={'/businesses'}>
                                        Businesses
                                    </Link>
                                ),
                            },
                        ]}
                    />
                    <Link className="text-decoration-none" href={'/businesses/create'}>
                        <Button type="dark" className="bg-theme fw-bold shadow text-white h-[37px]">
                            <PlusOutlined /> Create
                        </Button>
                    </Link>

                </div>

                <div className="flex items-center justify-between me-2">
                    <div className="flex items-center">
                        <input type="text" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="searchBox shadow-sm form-control" placeholder="" style={{ fontSize: "12px" }} />
                        <Button type="dark" className="bg-theme fw-bold shadow-sm text-white ms-1 h-[35px]" onClick={handleSearch}>Search</Button>
                    </div>
                </div>

                <div className="mt-3">
                    {businesses?.map((business) => (
                        <div key={business.id} className="card w-100 p-3 mb-2 shadow-sm">
                            <div className="flex justify-between">
                                {business.name}
                                <div className="flex">
                                    <Link href={'/businesses/edit/' + business.id} className={'text-decoration-none'}>
                                        <button className="me-1 bg-primary" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                            <EditOutlined />
                                        </button>
                                    </Link>
                                    <Popconfirm
                                        title="Delete this business"
                                        description="Are you sure to delete this business?"
                                        onConfirm={() => deleteBusiness(business.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button className="bg-danger" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                            <DeleteOutlined />
                                        </button>
                                    </Popconfirm>

                                </div>
                            </div>
                            <div>

                                {business?.users.length > 0 &&

                                    <table className="table table-bordered border mt-3">
                                        <thead>
                                            <tr>
                                                <th className="py-2">Name</th>
                                                <th>Email</th>
                                                <th>Created date</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {business.users?.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="py-3">{user.name}</td>
                                                    <td className="py-3">{user.email}</td>
                                                    <td className="py-3">{dayjs(user.created_at).format('MMMM D, YYYY h:mm A')}</td>
                                                    <td className="col-1 text-end">
                                                        <button onClick={() => setUserData(user)} className="me-1 bg-primary" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                            <EditOutlined />
                                                        </button>
                                                        <Popconfirm
                                                            title="Delete this user"
                                                            description="Are you sure to delete this user?"
                                                            onConfirm={() => deleteUser(user.id)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <button className="bg-danger" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                                <DeleteOutlined />
                                                            </button>
                                                        </Popconfirm>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                }


                            </div>
                            <div className={`flex justify-end ${business?.users.length > 0 ? '' : 'mt-3'}`}>
                                <Button type="dark" onClick={() => {
                                    setIsAddUserDialogOpen(true);
                                    setViewedBusiness(business);
                                    setForm({ ...form, business_id: business.id });
                                }} className="bg-theme fw-bold shadow-sm text-white"><PlusOutlined /> Add User</Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Dialog
                    open={isAddUserDialogOpen}
                >
                    <div className="p-4" style={{ borderRadius: "20px", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-between">
                            <div className="fw-bold" style={{ fontSize: "16px" }}>Add User to {viewedBusiness?.name}</div>
                            <button onClick={() => setIsAddUserDialogOpen(false)} className="text-decoration-none">X</button>
                        </div>
                        <div>
                            <label htmlFor="" className="d-block mt-3">Name</label>
                            <input type="text" className="inputBox shadow-sm" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Email</label>
                            <input type="email" className="inputBox shadow-sm" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Password</label>
                            <input type="text" className="inputBox shadow-sm" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <div className="" style={{ width: "350px" }}>
                                <button className="w-100 bg-theme fw-bold shadow-sm text-white h-[44px] mt-4 rounded-lg" onClick={() => addUser()}>
                                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : "Add User"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    open={isEditUserDialogOpen}
                >
                    <div className="p-4" style={{ borderRadius: "20px", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-between">
                            <div className="fw-bold" style={{ fontSize: "16px" }}>Edit User</div>
                            <button onClick={() => setIsEditUserDialogOpen(false)} className="text-decoration-none">X</button>
                        </div>
                        <div>
                            <label htmlFor="" className="d-block mt-3">Name</label>
                            <input type="text" className="inputBox shadow-sm" value={userEditForm.name} onChange={(e) => setUserEditForm({ ...userEditForm, name: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Email</label>
                            <input type="email" className="inputBox shadow-sm" value={userEditForm.email} onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Password</label>
                            <input type="text" className="inputBox shadow-sm" onChange={(e) => setUserEditForm({ ...userEditForm, password: e.target.value })} />
                            <div className="" style={{ width: "350px" }}>
                                <button className="w-100 bg-theme fw-bold shadow-sm text-white h-[44px] mt-4 rounded-lg" onClick={() => updateUser()}>
                                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>


            </AuthenticatedLayout>
        </>
    );
}
