import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Link, router } from "@inertiajs/react";
import { Breadcrumb, Button, Popconfirm, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import dayjs from "dayjs";
import { breadcrumbsClasses } from "@mui/material";

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
    const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
    const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
    const [isSetAdminDialogOpen, setIsSetAdminDialogOpen] = useState(false);
    const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewedBusiness, setViewedBusiness] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        business_id: '',
        branch_id: ''
    });

    const [userEditForm, setUserEditForm] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
    });

    const [branchForm, setBranchForm] = useState({
        name: '',
        address: '',
        business_id: '',
    });

    const [branchEditForm, setBranchEditForm] = useState({
        id: '',
        name: '',
        address: '',
    });


    useEffect(() => {

        setBusinesses(props?.businesses);

        console.log(props?.businesses);


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
        console.log(form);


        router.post('/users', form, {
            onSuccess: (response) => {
                setIsAddUserDialogOpen(false);
                setIsSetAdminDialogOpen(false);
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
                setIsSetAdminDialogOpen(false);
            },
            onError: (erros) => {

                setLoading(false);
                if (erros.name) {
                    toast.error(erros.name);
                }

                if (erros.email) {
                    toast.error(erros.email);
                }

                if(erros.password) {
                    toast.error(erros.password);
                }

            }
        })

    }

    const toggleBusiness = (id) => {
        setBusinesses(businesses.map((business) => {
            if (business.id === id) {
                business.is_active = !business.is_active;
            }
            return business;
        }));

        router.post('/businesses/toggle', { id: id });
    }

    const addBranch = () => {

        setLoading(true);

        router.post('/branches', branchForm, {
            onSuccess: (response) => {
                setIsAddBranchDialogOpen(false);
                setLoading(false);
            },
            onError: (errors) => {
                setLoading(false);
                if (errors.name) {
                    toast.error(errors.name);
                }

                if (errors.address) {
                    toast.error(errors.address);
                }
            }
        });
    }

    const updateBranch = () => {

        setLoading(true);

        router.post('/branches/update', branchEditForm, {
            onSuccess: (response) => {
                setIsEditBranchDialogOpen(false);
                setLoading(false);
            },
            onError: (errors) => {
                setLoading(false);
                if (errors.name) {
                    toast.error(errors.name);
                }

                if (errors.address) {
                    toast.error(errors.address);
                }
            }
        });

    }

    const deleteBranch = (id) => {

        setLoading(true);

        router.delete('/branches', { data: { id: id } }, {
            onSuccess: (response) => {
                setIsEditBranchDialogOpen(false);
                setLoading(false);
            },
            onError: (errors) => {
                setLoading(false);
                if (errors.name) {
                    toast.error(errors.name);
                }

                if (errors.address) {
                    toast.error(errors.address);
                }
            }
        });

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
                        <div className="bg-white rounded shadow-sm p-3 mb-3 border" key={business.id}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className=" bg-theme text-white w-[37px] h-[37px] rounded flex items-center justify-center uppercase fs-4">{business.name.charAt(0)}</div>
                                    <div className="ms-2 fw-bold" style={{ fontSize: 16 }}>{business.name}</div>
                                    <div className={`badge ms-2 px-2 py-1 ${business.is_active ? 'bg-success' : 'bg-danger'}`}>{business.is_active ? 'Active' : 'Inactive'}</div>
                                </div>
                                <div className="flex items-center">  <span className=" ">{business.campaign_start_date}</span> <img src="/images/arrow-right.png" className="mx-2" style={{ width: "17px" }} /> <span className="">{business.campaign_end_date}</span></div>
                                <div className="flex">
                                    <Switch color="danger" checked={business.is_active} onChange={(e) => toggleBusiness(business.id)} className="me-2" />
                                    <Link href={`/businesses/edit/${business.id}`}>
                                        <button className="me-1 bg-primary" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                            <EditOutlined />
                                        </button>
                                    </Link>
                                    <Popconfirm
                                        title="Delete this user"
                                        description="Are you sure to delete this user?"
                                        onConfirm={() => deleteBusiness(business?.id)}
                                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                    >
                                        <button className="bg-danger" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                            <DeleteOutlined />
                                        </button>
                                    </Popconfirm>

                                </div>
                            </div>

                            <div className="h-[1px] my-3" style={{ backgroundColor: "#e3e3e3" }}></div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">

                                    {business?.admins[0] ? (
                                        <>
                                            <div className="p-3 bg-secondary text-white w-[20px] h-[20px] rounded-circle flex items-center justify-center uppercase">{business.admins[0].name.charAt(0)}</div>
                                            <div className="ms-2 ">
                                                <div className="fw-bold">{business.admins[0].name} - Admin</div>
                                                <div style={{ fontSize: "11px" }}>{business.admins[0].email}</div>
                                            </div>
                                        </>
                                    )
                                        :
                                        <div className="text-gray-500">No admin has been set yet for this business.</div>
                                    }
                                </div>
                                <div className="flex">


                                    {business?.admins[0] ? (
                                        <>
                                            <button className="me-1 bg-primary" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }} onClick={() => setUserData(business?.admins[0])}>
                                                <EditOutlined />
                                            </button>
                                            <Popconfirm
                                                title="Delete this user"
                                                description="Are you sure to delete this user?"
                                                onConfirm={() => deleteUser(business?.admins[0].id)}
                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            >
                                                <button className="bg-danger" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                    <DeleteOutlined />
                                                </button>
                                            </Popconfirm>
                                        </>
                                    ) : (
                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => {
                                            setViewedBusiness(business);
                                            setForm({ ...form, business_id: business.id, branch_id: null });
                                            setIsSetAdminDialogOpen(true);
                                        }}>Set Admin</button>
                                    )}

                                </div>
                            </div>

                            <div className="h-[1px] my-3" style={{ backgroundColor: "#e3e3e3" }}></div>

                            <div className="mb-3">
                                {business?.branches.length > 0 && (
                                    business.branches.map((branch) => (
                                        <div className="bg-gray-100 p-3 rounded mt-3">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <img src="/images/map.png" style={{ width: "30px" }} />
                                                    <div>
                                                        <span className="ms-3 fw-bold" style={{ fontSize: "14px" }}>{branch.name}</span>
                                                        <div className="ms-3" style={{ fontSize: "10px" }}>{branch.address}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center ms-5">
                                                    <button onClick={() => {
                                                        setBranchEditForm({ ...branchEditForm, id: branch.id, name: branch.name, address: branch.address });
                                                        setIsEditBranchDialogOpen(true);
                                                    }} className="me-1 bg-primary" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                        <EditOutlined />
                                                    </button>
                                                    <Popconfirm
                                                        title="Delete this branch"
                                                        description="Are you sure to delete this branch?"
                                                        onConfirm={() => deleteBranch(branch.id)}
                                                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                    >
                                                        <button className="bg-danger" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                            <DeleteOutlined />
                                                        </button>
                                                    </Popconfirm>


                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center">

                                                <div>
                                                    Branch Users <span className="fw-normal text-success ms-1"> | {branch.users.length} {branch.users.length > 1 ? "users" : "user"}</span>
                                                </div>

                                                <button className="btn btn-sm btn-primary" onClick={() => {
                                                    setIsAddUserDialogOpen(true);
                                                    setViewedBusiness(business);
                                                    setForm({ ...form, business_id: null, branch_id: branch.id });
                                                }}>Add user</button>
                                            </div>

                                            {branch.users.length > 0 ? (
                                                branch.users.map((user) => (
                                                    <div className="flex items-center">
                                                        <div className="flex items-center mt-3">
                                                            <div className="w-[25px] h-[25px] rounded-circle flex items-center justify-center uppercase text-white" style={{ fontSize: "13px", backgroundColor: "#0B5ED7" }}>{user.name.charAt(0)}</div>
                                                            <div className="ms-1">
                                                                <div className="fw-bold">{user.name} - <span className="fw-normal">{user.email}</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center pt-3 ms-5">
                                                            <button onClick={() => setUserData(user)} className="me-1 bg-primary" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                                <EditOutlined />
                                                            </button>
                                                            <Popconfirm
                                                                title="Delete this user"
                                                                description="Are you sure to delete this user?"
                                                                onConfirm={() => deleteUser(user.id)}
                                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                            >
                                                                <button className="bg-danger" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                                    <DeleteOutlined />
                                                                </button>
                                                            </Popconfirm>


                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-secondary mt-2">No users in this branch.</div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div>
                                <button className="btn btn-sm btn-outline-success ms-1" onClick={() => {
                                    setViewedBusiness(business);
                                    setIsAddBranchDialogOpen(true);
                                    setBranchForm({ ...branchForm, business_id: business.id });
                                }}>Add Branch +</button>
                            </div>


                        </div>
                    ))}
                </div>

                <Dialog
                    open={isAddBranchDialogOpen}
                >
                    <div className="p-4" style={{ borderRadius: "20px", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-between">
                            <div className="fw-bold" style={{ fontSize: "16px" }}>Add Branch to {viewedBusiness?.name}</div>
                            <button onClick={() => setIsAddBranchDialogOpen(false)} className="text-decoration-none">X</button>
                        </div>
                        <div>
                            <label htmlFor="" className="d-block mt-3">Name</label>
                            <input type="text" className="inputBox shadow-sm" onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Address</label>
                            <input type="text" className="inputBox shadow-sm" onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })} />
                            <div className="" style={{ width: "350px" }}>
                                <button className="w-100 bg-theme fw-bold shadow-sm text-white h-[44px] mt-4 rounded-lg" onClick={() => addBranch()}>
                                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    open={isSetAdminDialogOpen}
                >
                    <div className="p-4" style={{ borderRadius: "20px", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-between">
                            <div className="fw-bold" style={{ fontSize: "16px" }}>Set Admin to {viewedBusiness?.name}</div>
                            <button onClick={() => setIsSetAdminDialogOpen(false)} className="text-decoration-none">X</button>
                        </div>
                        <div>
                            <label htmlFor="" className="d-block mt-3">Name</label>
                            <input type="text" className="inputBox shadow-sm" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Email</label>
                            <input type="email" className="inputBox shadow-sm" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Password</label>
                            <input type="text" className="inputBox shadow-sm" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <div className="text-xs text-gray-500 mt-2" style={{ width: "350px" }}>
                                Notice: Password must have at least one capital letter, one small letter, one number and one special character.
                            </div>
                            <div className="" style={{ width: "350px" }}>
                                <button className="w-100 bg-theme fw-bold shadow-sm text-white h-[44px] mt-4 rounded-lg" onClick={() => addUser()}>
                                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    open={isEditBranchDialogOpen}
                >
                    <div className="p-4" style={{ borderRadius: "20px", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-between">
                            <div className="fw-bold" style={{ fontSize: "16px" }}>Add Branch to {viewedBusiness?.name}</div>
                            <button onClick={() => setIsEditBranchDialogOpen(false)} className="text-decoration-none">X</button>
                        </div>
                        <div>
                            <label htmlFor="" className="d-block mt-3">Name</label>
                            <input type="text" value={branchEditForm.name} className="inputBox shadow-sm" onChange={(e) => setBranchEditForm({ ...branchEditForm, name: e.target.value })} />
                            <label htmlFor="" className="d-block mt-3">Address</label>
                            <input type="text" value={branchEditForm.address} className="inputBox shadow-sm" onChange={(e) => setBranchEditForm({ ...branchEditForm, address: e.target.value })} />
                            <div className="" style={{ width: "350px" }}>
                                <button className="w-100 bg-theme fw-bold shadow-sm text-white h-[44px] mt-4 rounded-lg" onClick={() => updateBranch()}>
                                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>

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
                            <div className="text-xs text-gray-500 mt-2" style={{ width: "350px" }}>
                                Notice: Password must have at least one capital letter, one small letter, one number and one special character.
                            </div>
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
                            <div className="text-xs text-gray-500 mt-2" style={{ width: "350px" }}>
                                Notice: Password must have at least one capital letter, one small letter, one number and one special character.
                            </div>
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
