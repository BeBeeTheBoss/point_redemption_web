import { useState } from "react";
import { router } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import { useEffect } from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { flash } = usePage().props;

    const handleSignin = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/login', { email, password }, {
            onError: (errors) => {
                setLoading(false);
                console.log(errors[0]);
                toast.error(errors[0]);

            },
            onSuccess: (response) => {
                setLoading(false);
                // console.log(response);

            }
        });
    };

    return (
        <>
            <style>{`
                .container-fluid {
                }
                .inputBox{
                    width: 100%;
                    border-color: #00000042;
                    margin: 10px 0;
                    height: 44px;
                    border-radius: 7px;
                }
            `}</style>

            <div className="container-fluid">
                <div className="logo mt-4 ms-2">
                    <img src="/images/PRO_1_Global_Logo.png" style={{ width: '100px' }} />
                </div>
                <div className="d-flex justify-around mx-20 items-center row" style={{ height: '88vh' }}>
                    <div className="col-lg-5 col-md-6 col-sm-12 col-12">
                        <img src="/images/vector.png" className="w-100" />
                    </div>
                    <div className="flex justify-center col-lg-5 col-md-6 col-sm-12 col-12">
                        <div className="text-center" style={{ width: "80%" }}>
                            <h5 className="text-2xl fw-bold">Sign in</h5>
                            <p>Enter your email and password to sign in</p>

                            <input onChange={(e) => setEmail(e.target.value)} type="text" className="inputBox" placeholder="Email" onKeyDown={(e) => {
                                if(e.key === 'Enter') handleSignin(e);
                            }}/>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" className="inputBox" placeholder="Password" onKeyDown={(e) => {
                                if(e.key === 'Enter') handleSignin(e);
                            }}/>

                            <div className="flex justify-start my-3">
                                <input type="checkbox" className="mr-2" style={{ width: "20px", height: "20px", color: "black", borderRadius: "7px" }} /> <span>Remember me</span>
                            </div>

                            <button onClick={handleSignin} className="bg-theme text-white w-100 rounded" style={{ height: "44px" }}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <span>Sign in</span>
                                )}
                            </button>

                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

