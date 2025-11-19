import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { UserOutlined, DollarOutlined, ShoppingOutlined, ShopOutlined, ExportOutlined } from '@ant-design/icons';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

export default function Histories() {

    const { props } = usePage();
    const [histories, setHistories] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [users, setUsers] = useState([]);

    const exportToExcel = (data, fileName = "export.xlsx") => {

        let excelData = [];

        if (data.length === 0) {
            toast.error("No data to export");
            return;
        }

        data.forEach((item) => {
            excelData.push({
                "Member Name": item.member_name,
                "Member ID Card": item.member_idcard,
                "Promotion Name": item.promotion_name,
                "Promotion Code": item.promotion_code,
                "Quantity": item.qty,
                "Redeemed Points": item.redeemed_points,
                "Business Name": item.business_name,
                "Branch Name": item.branch_name,
                "Date": new Date(item?.created_at).toLocaleString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).replace('a.m.', 'AM').replace('p.m.', 'PM').replace(',', '')
            });
        });

        // Convert JSON to worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Download
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const today = new Date().toISOString().split('T')[0];
        const fileNameWithDate = `${fileName.split('.')[0]}-${today}.${fileName.split('.')[1]}`;
        saveAs(dataBlob, fileNameWithDate);
    };

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
                <div className="fw-bold mt-4 mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                    
                    <div style={{ fontSize: "19px" }}>Histories</div>

                    {/* <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">

                        <select className="p-2 rounded-lg border shadow-sm">
                        {Array.from({ length: 12 }, (_, i) => {
                        const date = new Date(0, i);
                        const monthName = date.toLocaleString('en-US', { month: 'long' });
                        return (
                        <option key={i} value={i + 1}>
                        {monthName}
                        </option>
                        );
                        })}
                        </select>


                        <select className="p-2 rounded-lg border shadow-sm">
                        {Array.from({ length: 50 }, (_, i) => {
                        const year = 2000 + i;
                        return (
                        <option key={year} value={year}>
                        {year}
                        </option>
                        );
                        })}
                        </select>
                        </div>
                    </div> */}
                    </div>
                    <div>
                        <button className="btn btn-sm btn-dark" onClick={() => exportToExcel(histories, "point-redemption-report.xlsx")}><ExportOutlined className="me-1" /> Export to Excel</button>
                    </div>
                </div>
                <div className="shadow mt-2 mx-2 mb-3">
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
                            <div className="col-2" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div>{history.member_name}</div>
                                <div className="fw-bold text-[]">{history.member_idcard}</div>
                            </div>
                            <div className="col-4" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
