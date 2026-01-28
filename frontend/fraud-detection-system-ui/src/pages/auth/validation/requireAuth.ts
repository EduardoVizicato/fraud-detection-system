import React from "react";
import { Navigate, Outlet } from "react-router";
import { isAuthed } from "./auth";

export default function requireAuth(){
    if(!isAuthed)
        return React.createElement(Navigate, { to: "/login", replace: true });

    return React.createElement(Outlet);
}