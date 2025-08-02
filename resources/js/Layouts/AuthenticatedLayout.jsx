import { Link, router, usePage } from "@inertiajs/react";
import { CaretDownOutlined, BarChartOutlined, ClockCircleOutlined, BellOutlined, OrderedListOutlined } from "@ant-design/icons";

export default function AuthenticatedLayout({ children }) {

    const { auth } = usePage().props;
    const user = auth?.user;
    const { url } = usePage();
    const urlSegments = url.split('/');
    let currentRoute;

    currentRoute = urlSegments[1];

    return (
        <>
            <style>
                {`
                .bg-overlay {
                    background-color: #ffffff25;
                    color: white !important;
                }
                .navBtn{
                    color: #ffffff7c;
                    transition: all 0.3s ease-in-out;
                }
                .navBtn:hover{
                    color: white !important;
                }
                .logoutBtn{
                    width: 86%;
                    border: solid 1px red;
                    padding: 8px;
                    color: red;
                    border-radius: 8px;
                    transition: all 0.3s ease-in-out;
                }
                .logoutBtn:hover{
                    background-color: red;
                    color: white;
                }
                `}
            </style>
            <div className="container-fluid min-h-screen" style={{ fontSize: "13px" }}>
                <div className="row">
                    <div className="col-2" style={{ position: "fixed", height: "100vh", position: "relative" }}>
                        <div className="bg-theme rounded shadow-sm p-2 px-3" style={{ marginLeft: "-6px", marginTop: "5px", height: "98.5vh" }}>
                            <div className="text-white brand fw-bold text-center" style={{ borderBottom: "1px solid #dfdfdf65", paddingBottom: "25px", marginTop: "18px" }}>
                                <BarChartOutlined style={{ fontSize: "20px", marginRight: "1px" }} /> Admin Dashboard
                            </div>
                            <div className="text-white gap-2 mt-3" style={{ borderBottom: "1px solid #dfdfdf65" }}>
                                <div className="flex justify-between items-center p-2 rounded mb-3" style={{ backgroundColor: "#ffffff25" }}>
                                    <div className="flex items-center ms-1">
                                        <img src="/images/user_profile.png" style={{ width: "20px", marginRight: "6px" }} />
                                        {user?.name}
                                    </div>
                                    <div>
                                        {/* <CaretDownOutlined style={{ fontSize: "12px" }} /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="text-white mt-3 ms-2 fw-bold">
                                PAGES
                            </div>
                            <div className="text-white mt-3">
                                <Link href={'/histories'} style={{ textDecoration: "none" }}>
                                    <button className={`flex justify-start items-center p-2 rounded navBtn ${currentRoute === 'histories' ? 'bg-overlay' : ''}`} style={{ width: "100%", textAlign: "left" }}>
                                        <ClockCircleOutlined style={{ fontSize: "20px", marginRight: "7px" }} /> Histories
                                    </button>
                                </Link>
                                <Link href={'/notifications'} style={{ textDecoration: "none" }}>
                                    <button className={`flex justify-start items-center p-2 rounded navBtn ${currentRoute === 'notifications' ? 'bg-overlay' : ''}`} style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
                                        <BellOutlined style={{ fontSize: "20px", marginRight: "7px" }} /> Notifications
                                    </button>
                                </Link>
                                <Link href={'/businesses'} style={{ textDecoration: "none" }}>
                                    <button className={`flex justify-start items-center p-2 rounded navBtn ${currentRoute === 'businesses' ? 'bg-overlay' : ''}`} style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
                                        <OrderedListOutlined style={{ fontSize: "20px", marginRight: "9px" }} /> Businesses
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", width: "100%" }}>
                            <button onClick={() => router.post('/logout')} className="logoutBtn">Log out</button>
                        </div>
                    </div>
                    <div className="col-10" style={{ position: "absolute", right: 0, height: "100vh", overflowY: "scroll" }}>
                        {children}
                    </div>
                </div>
            </div>
        </>

    );
}
