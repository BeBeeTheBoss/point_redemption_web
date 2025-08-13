import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { UserOutlined, DollarOutlined, ShoppingOutlined, ShopOutlined } from '@ant-design/icons';

export default function Histories() {

    const { props } = usePage();
    const [histories, setHistories] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [users, setUsers] = useState([]);

    useEffect(() => {

        setHistories(props.histories.data);

        let points = 0;

        props.histories.data.map(history => {
            if (!users.includes(history.member_idcard)) {
                users.push(history.member_idcard);
            }
            points += history.redeemed_points;
        })
        setTotalPoints(points);

    }, [props]);

    return (
        <AuthenticatedLayout>
            <div className="mt-4">
                <div className="row">
                    <div className="col-3">
                        <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white", borderLeftColor: "#1E43C0", borderLeftWidth: 20 }}>
                            <div className="fw-bold">Total Users</div>
                            <div className="my-1 fw-bold text-[#1E43C0]" style={{ fontSize: "23px" }}><UserOutlined /> {users.length.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                            <div className="fw-bold">this month</div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="p-3  rounded shadow-sm" style={{ backgroundColor: "white", borderLeftColor: "#0A808A", borderLeftWidth: 20 }}>
                            <div className="fw-bold">Redeemed Points</div>
                            <div className="my-1 fw-bold text-[#0A808A]" style={{ fontSize: "23px" }}><DollarOutlined /> {totalPoints.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                            <div className="fw-bold">this month</div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="p-3  rounded shadow-sm" style={{ backgroundColor: "white", borderLeftColor: "#4f04c0ff", borderLeftWidth: 20 }}>
                            <div className="fw-bold">Active Promotions</div>
                            <div className="my-1 fw-bold text-[#4f04c0ff]" style={{ fontSize: "23px" }}><ShoppingOutlined /> {props.promotions_count.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                            <div className="fw-bold">this month</div>
                        </div>
                    </div>
                    {/* #EA580C */}
                    <div className="col-3">
                        <div className="p-3  rounded shadow-sm" style={{ backgroundColor: "white", borderLeftColor: "#EA580C", borderLeftWidth: 20 }}>
                            <div className="fw-bold">Partner Businesses</div>
                            <div className="my-1 fw-bold text-[#EA580C]" style={{ fontSize: "23px" }}><ShopOutlined /> {props.business_count.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                            <div className="fw-bold">this month</div>
                        </div>
                    </div>
                </div>
                <div className="fs-5 fw-bold mt-4 mb-3">Histories</div>
                <div className="shadow mt-2 mx-2 mb-1">
                    <div className="row p-3 bg-white border" style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <div className="col-2 text-center text-muted">MEMBER</div>
                        <div className="col-4 text-center text-muted">PROMOTION</div>
                        <div className="col-1 text-muted">QTY</div>
                        <div className="col-1 text-muted">POINTS</div>
                        <div className="col-2 text-muted">BUSINESS</div>
                        <div className="col-2 text-muted">DATE</div>
                    </div>
                    {histories.map((history) => (
                        <div className="row p-3 bg-white border mt-3">
                            <div className="col-2" style={{ display: "flex", flexDirection: "column",alignItems: "center" }}>
                                <div>{history.member_name}</div>
                                <div className="fw-bold text-[]">{history.member_idcard}</div>
                            </div>
                            <div className="col-4" style={{ display: "flex", flexDirection: "column",alignItems: "center" }}>
                                <div>{history.promotion_name}</div>
                                <div className="fw-bold text-[]">{history.promotion_code}</div>
                            </div>
                            <div className="col-1">x {history.qty}</div>
                            <div className="col-1 fw-bold text-success">{history.redeemed_points}</div>
                            <div className="col-2">{history.business_name}({history.branch_name})</div>
                            <div className="col-2">{
                                new Date(history?.created_at).toLocaleString('en-CA', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }).replace('a.m.', 'AM').replace('p.m.', 'PM').replace(',', '')
                            }</div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
