import {ADToBS, BSToAD} from "../Helper/DateHelper.tsx";


const useDateFunction = () => {
    const convertDate = ({date, to = "bs"}: { date: string, to?: "ad" | "bs" }) => {
        let convertedDate: string;
        if (to === 'bs') {
            convertedDate = ADToBS(date)
        } else {
            convertedDate = BSToAD(date)
        }
        const [year, month, day] = convertedDate.split('-').map(Number);
        return {
            year: year,
            month: month,
            day: day
        };
    }


    return {
        convertDate,
    };
}

export default useDateFunction;