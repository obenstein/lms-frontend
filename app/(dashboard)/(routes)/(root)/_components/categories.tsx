"use client"

import {FcEngineering,FcFilmReel,FcMultipleDevices,FcMusic,FcOldTimeCamera,FcSalesPerformance,FcSportsMode} from "react-icons/fc"
import { IconType } from "react-icons"
import { CategoryItem } from "./category-item"

interface categoriesProps{
    items: {_id:string, name: string}[]
}

const iconMap: Record<{name: string}["name"], IconType> = {
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Computer Scince": FcMultipleDevices,
    "Film": FcFilmReel,
    "Engineering": FcEngineering
}

export const Categories = ({ items } : categoriesProps) => {
    if (items.length === 0) return null

    return(<div className="flex items-center gap-x-2 overflow-x-auto py-1">
        {items.map((item,idx) =>{
            return(
                <CategoryItem
                key={idx}
                label={item.name}
                icon={iconMap[item.name]}
                value={item._id}
                />
            )
        })}
    </div> )
}