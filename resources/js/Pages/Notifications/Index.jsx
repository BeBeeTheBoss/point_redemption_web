import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, router } from "@inertiajs/react";
import { Breadcrumb, Button, Modal } from "antd";
import { usePage } from "@inertiajs/react";
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';

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
    const [filteredBusinessId, setFilteredBusinessId] = useState(null);

    const [notifications, setNotifications] = useState(props.notifications?.data)
    const [notiIdForDelete, setNotiIdForDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [viewedImage, setViewedImage] = useState(null);

    useEffect(() => {

        console.log(props);


        if (props?.flash.success) {
            toast.success(props?.flash.success);
        }

        if (props?.errors) {
            toast.error(props?.errors[0]);
        }


    }, [props]);

    const deleteNotification = () => {
        router.delete('/notifications', {
            data: { id: notiIdForDelete },
            onSuccess: () => {
                setIsModalOpen(false);
                setNotifications(notifications.filter(noti => noti.id !== notiIdForDelete));
            }
        })
    }

    const handleSearch = () => {
        if (filteredBusinessId) {
            setNotifications(props.notifications?.data.filter(noti =>
                noti.title.toLowerCase().includes(searchKey.toLowerCase()) && noti.business_id === (filteredBusinessId == 'all' ? null : filteredBusinessId)
            ))
        } else {
            setNotifications(props.notifications?.data.filter(noti =>
                noti.title.toLowerCase().includes(searchKey.toLowerCase())
            ))
        }
    }

    const filterNotifications = () => {

        setIsFilterDialogOpen(false);
        if(!filteredBusinessId) return;
        setNotifications(props?.notifications?.data.filter(noti => noti.title.toLowerCase().includes(searchKey.toLowerCase()) && noti.business_id === (filteredBusinessId == 'all' ? null : filteredBusinessId)));
    }

    return (
        <>
            <style>{`
                .inputBox{
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
                                    <Link className={`text-decoration-none ${currentRoute == 'notifications' ? 'text-black' : ''}`} href={'/notifications'}>
                                        Notifications
                                    </Link>
                                ),
                            },
                        ]}
                    />
                    <Link className="text-decoration-none" href={'/notifications/create'}>
                        <Button type="dark" className="bg-theme fw-bold shadow text-white h-[37px]">
                            <PlusOutlined /> Create
                        </Button>
                    </Link>

                </div>
                <div className="flex items-center justify-between me-2">
                    <div className="flex items-center">
                        <input type="text" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="inputBox shadow-sm form-control" placeholder="" style={{ fontSize: "12px" }} />
                        <Button type="dark" className="bg-theme fw-bold shadow-sm text-white ms-1 h-[35px]" onClick={handleSearch}>Search</Button>
                    </div>
                </div>

                <table className="table shadow-sm mt-3 table-bordered border" style={{ fontSize: "12px" }}>
                    <thead className="">
                        <tr className="" style={{ color: "#A2A4AE" }}>
                            <th className="py-3">ACTION</th>
                            <th className="py-3">TITLE</th>
                            <th className="py-3">BODY</th>
                            <th className="py-3">IMAGE</th>
                            <th className="py-3 flex items-center">
                                TO
                                <div className="py-1 px-1 cursor-pointer" onClick={() => setIsFilterDialogOpen(true)} style={{ position: "relative" }}>
                                    <img className="ms-1 cursor-pointer" src="/images/sort.png" style={{ width: "15px", height: "15px" }} />
                                    {filteredBusinessId && <div className="badge bg-danger" style={{ position: "absolute", top: "0px", right: "-3px", fontSize: "6px" }}>
                                        1
                                    </div>}
                                </div>

                            </th>
                            <th className="py-3">DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification) => (
                            <tr key={notification.id}>
                                <td className="col-1 text-start">
                                    <div className="flex">
                                        <Link href={'/notifications/edit/' + notification.id} className={'text-decoration-none'}>
                                            <button className="me-1 bg-primary" style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                                <EditOutlined />
                                            </button>
                                        </Link>
                                        <button className="bg-danger" onClick={() => {
                                            setIsModalOpen(true)
                                            setNotiIdForDelete(notification.id)
                                        }} style={{ width: "20px", height: "20px", color: "white", borderRadius: "4px" }}>
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                </td>
                                <td className="text-start">{notification.title}</td>
                                <td className="text-start col-4">{notification.body}</td>
                                <td className="col-1">
                                    {notification.image && <img src={notification.image} onClick={() => {
                                        setIsDialogOpen(true);
                                        setViewedImage(notification.image);
                                    }} className="border-0 cursor-pointer" style={{ width: "50px", height: "50px", objectFit: "cover", objectPosition: "center" }} />}
                                </td>
                                <td>
                                    {notification.to}
                                </td>
                                <td className="col-2">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(notification.created_at))}</td>



                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal
                    title="Confirm Delete"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    okText="Delete"
                    okType="danger"
                    centered
                    onOk={deleteNotification}
                    onCancel={() => setIsModalOpen(false)}
                >
                    <div className="my-4">
                        <p>Are you sure you want to delete this notification titled <span className="fw-bold">"{notifications.find((notification) => notification.id === notiIdForDelete)?.title}"</span>?</p>
                    </div>
                </Modal>

                <Dialog
                    open={isDialogOpen}
                >
                    <div style={{ position: "relative" }}>
                        <img src={viewedImage} alt="" />
                        <button className="btn btn-sm bg-danger text-light rounded-lg" style={{ position: "absolute", top: "10px", right: "10px" }} onClick={() => {
                            setViewedImage(null);
                            setIsDialogOpen(false);
                        }}>X</button>
                    </div>
                </Dialog>

                <Dialog
                    open={isFilterDialogOpen}
                >
                    <div className="card" style={{ width: "400px" }}>
                        <div className="card-header flex justify-between">
                            <div>Filter by</div>
                            <button className="btn btn-sm bg-light rounded-lg" onClick={() => {
                                setIsFilterDialogOpen(false);
                            }}>X</button>
                        </div>
                        <div className="card-body">
                            <div className="flex my-2 flex-wrap">
                                <button onClick={() => setFilteredBusinessId('all')} className={`rounded-pill px-2 py-1 me-2 my-2 ${filteredBusinessId === 'all' ? "bg-filter" : ""}`} style={{ border: "0.1px solid #494949ff" }}>
                                    All
                                </button>
                                {props?.businesses?.map((business) => (
                                    <button onClick={() => setFilteredBusinessId(business.id)} key={business.id} className={`rounded-pill px-2 me-2 my-2 py-1 ${business.id === filteredBusinessId ? "bg-filter" : ""}`} style={{ border: "0.1px solid #494949ff" }}>
                                        {business.name}
                                    </button>
                                ))}
                            </div>

                        </div>
                        <div className="card-footer flex justify-end">
                            <button className="px-3 py-1 me-2 rounded-lg" style={{ border: "0.1px solid #494949ff" }} onClick={() => {
                                setIsFilterDialogOpen(false);
                                setFilteredBusinessId(null);
                                setSearchKey('');
                                setNotifications(props?.notifications?.data);
                            }}>Clear</button>
                            <button className="bg-theme text-light px-3 py-1 rounded-lg" onClick={() => filterNotifications()}>Apply</button>
                        </div>
                    </div>
                </Dialog>

            </AuthenticatedLayout>
        </>
    );
}
