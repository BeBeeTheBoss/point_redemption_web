import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb } from "antd";
import { usePage, Link, router } from "@inertiajs/react";
import { Button, Select, Spin, DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, LoadingOutlined, FileImageOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function Create() {

    const { url, props } = usePage();
    const currentRoute = url.split('/').pop();

    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        promotions: [],
        campaign_end_date: '',
        campaign_start_date: ''
    });

    const createBusiness = () => {

        setLoading(true);

        router.post('/businesses', form, {
            onError: (errors) => {

                setLoading(false);

                if (errors.name) {
                    toast.error(errors.name);
                }

                if (errors.campaign_start_date) {
                    toast.error(errors.campaign_start_date);
                }

                if (errors.campaign_end_date) {
                    toast.error(errors.campaign_end_date);
                }

            }
        });

    }

    useEffect(() => {

        setPromotions(props.promotions);

    }, []);

    const handleChangePromotions = (e) => {

        setForm({
            ...form,
            promotions: e
        });

    }

    return (
        <>
            <style>{`
                .inputBox{
                    width: 380px !important;
                    border-color: #00000042;
                    height: 44px;
                    border-radius: 7px;
                }

            `}</style>
            <AuthenticatedLayout>
                <div className="mt-4">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link className={`text-decoration-none ${currentRoute == 'businesses' ? 'text-black fw-bold' : ''}`} href={'/businesses'}>
                                        Businesses
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link className={`text-decoration-none ${currentRoute == 'create' ? 'text-black fw-bold' : ''}`} href={'/businesses/create'}>
                                        Create
                                    </Link>
                                ),
                            },
                        ]}
                    />
                </div>
                <div className="flex justify-center items-center" style={{ height: "90vh" }}>
                    <div className="bg-white rounded shadow p-4 border">
                        <div className="fw-bold mt-2 text-theme" style={{ fontSize: "17px" }}>Create new business</div>

                        <div className="mt-2">
                            <label className="mt-3 mb-2" style={{ fontSize: 15 }}>Name</label>
                            <div>
                                <input type="text" className="inputBox" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
                            </div>
                            <label htmlFor="" className="mt-3 mb-2" style={{ fontSize: 15 }}>Promotions</label>
                            <div>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width:380 }}
                                    placeholder="Please select"
                                    onChange={handleChangePromotions}
                                    options={promotions.map((promotion) => ({
                                        value: promotion.point_exchange_promotion_pro_no,
                                        label: promotion.point_exchange_promotion_pro_no,
                                    }))}
                                />
                            </div>
                            <label className="mt-3 mb-2" style={{ fontSize: 15 }}>Campaign start date</label>
                            <div>
                                <DatePicker onChange={(e) => setForm({ ...form, campaign_start_date: new Date(e).toISOString().split('T')[0] })} style={{ width: "100%", height: "44px" }} />
                            </div>
                            <label className="mt-3 mb-2" style={{ fontSize: 15 }}>Campaign end date</label>
                            <div>
                                <DatePicker onChange={(e) => setForm({ ...form, campaign_end_date: new Date(e).toISOString().split('T')[0] })} style={{ width: "100%", height: "44px" }} />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button type="dark" className="bg-theme text-white fw-bold h-[37px]" onClick={createBusiness}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <span>Save</span>
                                )}
                            </Button>
                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
