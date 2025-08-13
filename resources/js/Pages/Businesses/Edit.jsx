import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb } from "antd";
import { usePage, Link, router } from "@inertiajs/react";
import { Button, Select, Spin, DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function Create() {

    const { url, props } = usePage();
    const urlSegments = url.split('/');
    const currentRoute = urlSegments[urlSegments.length - 2];

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        id: '',
        name: '',
        promotions: '',
        campaign_start_date: '',
        campaign_end_date: ''
    });

    useEffect(() => {

        setForm({
            id: props.business.id,
            name: props.business.name,
            promotions: props.business.promotions,
            campaign_start_date: dayjs(props.business.campaign_start_date, 'YYYY-MM-DD'),
            campaign_end_date: dayjs(props.business.campaign_end_date, 'YYYY-MM-DD')
        });
    }, []);

    const updateBusiness = () => {

        setLoading(true);

        const data = {
            id: form.id,
            name: form.name,
            promotions: form.promotions,
            campaign_start_date: new Date(form.campaign_start_date).toISOString().split('T')[0],
            campaign_end_date: new Date(form.campaign_end_date).toISOString().split('T')[0]
        }

        router.post('/businesses/update', data, {
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

    const handleChangePromotions = (e) => {

        console.log(e);


        setForm({
            ...form,
            promotions: e
        });

    }

    return (
        <>
            <style>{`
                .inputBox{
                    width: 350px !important;
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
                                    <Link className={`text-decoration-none ${currentRoute == 'edit' ? 'text-black fw-bold' : ''}`} href={'/businesses/edit'}>
                                        Edit
                                    </Link>
                                ),
                            },
                        ]}
                    />
                </div>
                <div className="flex justify-center items-center" style={{ height: "90vh" }}>
                    <div className="bg-white rounded shadow p-4 border">
                        <div className="fw-bold mt-2 text-theme" style={{ fontSize: "17px" }}>Edit business</div>

                        <div className="mt-2">
                            <label className="mt-3 mb-2">Name</label>
                            <div>
                                <input type="text" className="inputBox" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
                            </div>
                            <label htmlFor="" className="mt-3 mb-2" style={{ fontSize: 15 }}>Promotions</label>
                            <div>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: 380 }}
                                    placeholder="Please select"
                                    value={form?.promotions}
                                    onChange={handleChangePromotions}
                                    options={props.promotions?.map((promotion) => ({
                                        value: promotion.point_exchange_promotion_pro_no,
                                        label: promotion.point_exchange_promotion_pro_no,
                                    }))}
                                />
                            </div>
                            <label className="mt-3 mb-2">Campaign start date</label>
                            <div>
                                <DatePicker value={form.campaign_start_date} onChange={(e) => setForm({ ...form, campaign_start_date: e })} style={{ width: "100%", height: "44px" }} />
                            </div>
                            <label className="mt-3 mb-2">Campaign end date</label>
                            <div>
                                <DatePicker value={form.campaign_end_date} onChange={(e) => setForm({ ...form, campaign_end_date: e })} style={{ width: "100%", height: "44px" }} />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button type="dark" className="bg-theme text-white fw-bold h-[37px]" onClick={updateBusiness}>
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
