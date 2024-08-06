import React, { useEffect } from "react";

const extract_code = () => {
    console.log("asd");
    const urlParams = new URL(window.location.href).searchParams;
    console.log(urlParams.get("code"));
};

const CallBack = () => {
    useEffect(() => {
        extract_code();
    }, []); // Empty dependency array to run useEffect only once on mount

    return <></>;
};

export default CallBack;
