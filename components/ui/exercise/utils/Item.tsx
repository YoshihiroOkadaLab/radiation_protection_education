import React from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

import style from "../../../../styles/css/exercise.module.css";

export type ScenarioProps = {
    isEnglish?: boolean;
};

/**
 *
 */
export type ItemProps = {
    children: React.ReactNode;
    isDone: boolean;
    color?: string;
    fontSize?: string;
};
export function Item({
    children,
    isDone,
    color = "#65BF74",
    fontSize = "0.8rem",
}: ItemProps) {
    return (
        <>
            <div className={`${style.item}`}>
                <div className={`${style.check}`}>
                    {isDone ? (
                        <CheckBox sx={{ color: color, fontSize: fontSize }} />
                    ) : (
                        <CheckBoxOutlineBlank sx={{ fontSize: fontSize }} />
                    )}
                </div>
                <div
                    className={`${style.objective} ${
                        isDone && `${style.done}`
                    }`}
                >
                    {children}
                </div>
            </div>
        </>
    );
}

export type SubItemProps = {
    children: React.ReactNode;
    isDone?: boolean;
};
export function SubItem({ children, isDone = false }: SubItemProps) {
    return (
        <>
            <p className={`${style.sub} ${isDone && `${style.done}`}`}>
                {children}
            </p>
        </>
    );
}
