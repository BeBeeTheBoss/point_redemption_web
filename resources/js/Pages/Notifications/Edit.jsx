import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb } from "antd";
import { usePage, Link, router } from "@inertiajs/react";
import { Button, Select, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, LoadingOutlined, FileImageOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function Create() {

    const { url, props } = usePage();
    const urlSegments = url.split('/');
    const currentRoute = urlSegments[urlSegments.length - 2];
    const fileInputRef = useRef(null);
    const businesses = props.businesses;
    const notification = props.notification;

    console.log(props);


    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        body: '',
        to: '',
        image: null,
        deleteImage: false
    });

    useEffect(() => {
        if (notification) {
            setForm({
                id: notification.id,
                title: notification.title,
                body: notification.body,
                to: notification.business_id ?? 'all',
                image: null,
            });
            setImgPreview(notification.image);
        }
    }, [notification]);

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setImgPreview(URL.createObjectURL(selectedFile));
            setForm({
                ...form,
                image: selectedFile,
            });
        }
    };

    const updaetNotification = () => {

        setLoading(true);
        router.post('/notifications/update', form, {
            onError: (errors) => {

                setLoading(false);

                if (errors.title) {
                    toast.error(errors.title);
                } else {
                    toast.error(errors[0]);
                }

            },
            onSuccess: (response) => {
                setLoading(false);
            }
        })

    }

    return (
        <>
            <style>{`
                .inputBox{
                    width: 100%;
                    border-color: #00000042;
                    margin: 10px 0;
                    height: 44px;
                    border-radius: 7px;
                }
                .inputBoxLarge{
                    width: 100%;
                    border-color: #00000042;
                    margin: 10px 0;
                    border-radius: 7px;
                }
                .imgPicker{
                    width: 100%;
                    height: 213px;
                    border: 2px dashed #97979742;
                    margin: 10px 0;
                    border-radius: 7px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

            `}</style>
            <AuthenticatedLayout>
                <div className="mt-4">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link className={`text-decoration-none ${currentRoute == 'notifications' ? 'text-black fw-bold' : ''}`} href={'/notifications'}>
                                        Notifications
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link className={`text-decoration-none ${currentRoute == 'edit' ? 'text-black fw-bold' : ''}`} href={'/notifications/edit'}>
                                        Edit
                                    </Link>
                                ),
                            },
                        ]}
                    />
                </div>
                <div className="flex justify-center items-center" style={{ height: "90vh" }}>
                    <div className="bg-white rounded shadow p-4 border">
                        <div className="fw-bold mt-2 text-theme" style={{ fontSize: "17px" }}>Edit notification</div>

                        <div className="mt-4 row">
                            <div className="col-6">
                                <label htmlFor="">Title</label>
                                <input type="text" className="inputBox" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className=" col-6">
                                <label htmlFor="">To</label>
                                <Select
                                    className="inputBox"
                                    placeholder="Select a business"
                                    style={{ width: "260px" }}
                                    value={form.to}
                                    onChange={(value) => setForm({ ...form, to: value })}
                                    options={[
                                        {
                                            value: "all",
                                            label: 'All'
                                        },
                                        ...businesses.map((business) => ({
                                            value: business.id,
                                            label: business.name
                                        }))
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="mt-2 row">
                            <div className="col-6">
                                <label htmlFor="">Body</label>
                                <textarea className="inputBoxLarge" rows="10" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}></textarea>
                            </div>
                            <div className=" col-6">
                                <label htmlFor="">Image</label>
                                {imgPreview ?

                                    <div className="imgPreview" style={{ position: "relative" }}>
                                        <img className="img-thumbnail" src={imgPreview} style={{ width: "260px", height: "213px", objectFit: "cover", objectPosition: "center", marginTop: "10px", borderRadius: "7px" }} />
                                        <button className="btn btn-light btn-sm" style={{ position: "absolute", top: "10px", right: "10px" }} onClick={() => {
                                            setImgPreview(null);
                                            if (notification.image) setForm({ ...form, deleteImage: true });
                                        }}>X</button>
                                    </div>

                                    :

                                    <div className="imgPicker">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            className="d-none"
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            type="button"
                                            className="fw-bold shadow-sm rounded-lg border text-theme"
                                            onClick={handleBrowseClick}
                                        >
                                            <FileImageOutlined /> Browse photos
                                        </Button>
                                    </div>

                                }

                            </div>
                        </div>

                        <div className="flex justify-end ">
                            <Button type="dark" className="bg-theme text-white fw-bold h-[37px]" onClick={updaetNotification}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <span>Update</span>
                                )}
                            </Button>
                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
