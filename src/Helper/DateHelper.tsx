import DateClass from "../Function/BikramSambat.tsx";


export const BSToAD = (date: string): string => {
    return new DateClass().setDate(date, "BS").toAD()
}

export const ADToBS = (date: Date | string): string => {
    return new DateClass().setDate(date, "AD").toBS()
}
