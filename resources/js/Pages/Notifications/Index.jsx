import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import { Breadcrumb, Button } from "antd";
import { usePage } from "@inertiajs/react";
import { PlusOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Histories() {

    const { url, props } = usePage();
    const urlSegments = url.split('/');
    let currentRoute;
    if (urlSegments.length === 2) {
        currentRoute = urlSegments[urlSegments.length - 1];
    } else if (urlSegments.length === 3) {
        currentRoute = urlSegments[1];
    }

    const [notifications, setNotifications] = useState(props.notifications?.data)

    console.log(props);


    useEffect(() => {

        if (props?.flash.success) {
            toast.success(props?.flash.success);
        }

    }, []);

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
                <div className="flex items-center">
                    <input type="text" className="inputBox shadow-sm form-control" placeholder="" style={{ fontSize: "12px" }}/>
                    <Button type="dark" className="bg-theme fw-bold shadow-sm text-white ms-1 h-[35px]">Search</Button>
                </div>

                <table className="table shadow-sm mt-3 table-bordered border" style={{ fontSize: "12px" }}>
                    <thead className="">
                        <tr className="" style={{ color: "#A2A4AE" }}>
                            <th className="py-3">ACTION</th>
                            <th className="py-3">TITLE</th>
                            <th className="py-3">BODY</th>
                            <th className="py-3">IMAGE</th>
                            <th className="py-3">TO</th>
                            <th className="py-3">DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification) => (
                            <tr key={notification.id}>
                                <td className="col-1 text-start">
                                    <div className="flex">
                                        <button className="me-1 bg-primary" style={{ width: "20px",height: "20px",color: "white",borderRadius: "4px" }}>
                                            <EditOutlined />
                                        </button>
                                        <button className="bg-danger" style={{ width: "20px",height: "20px",color: "white",borderRadius: "4px" }}>
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                </td>
                                <td className="text-start">{notification.title}</td>
                                <td className="text-start">{notification.body}</td>
                                <td className="col-1">
                                    {notification.image && <img src={notification.image} className="border-0" style={{ width: "50px", height: "50px", objectFit: "cover", objectPosition: "center" }} />}
                                </td>
                                <td>
                                    {notification.to}
                                </td>
                                <td className="col-2">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(notification.created_at))}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>

            </AuthenticatedLayout>
        </>
    );
}
