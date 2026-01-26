import { useEffect, useMemo, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const API_BASE = "http://localhost:8000";

type CsvResponse = {
    file: string;
    columns: string[];
    total_rows: number;
    offset: number;
    limit: number;
    rows: Record<string, any>[];
}

function isNumber(value: any){
    if(value === null || value === undefined)
        return false;

    if(typeof value === "number")
        return !Number.isNaN(value)

    const number = Number(String(value).replace(",", "."));
    return !Number.isNaN(number);
}

function toNumber(value: any){
    if(typeof value === "number")
        return value

    return Number(String(value).replace(",", "."));
}

export default function Dashboard(){
    
}