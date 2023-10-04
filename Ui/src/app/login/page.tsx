"use client";

import React from "react";
import LoginCard from "../components/LoginCard";
import { useHashConnectContext } from "../context/useHashConnect";

const Page = () => {

    const { openModal } = useHashConnectContext();

    return (
        <div>
            <LoginCard handleConnect={openModal} />
        </div>
    );
};

export default Page;
