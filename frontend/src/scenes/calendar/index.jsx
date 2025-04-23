import { useState } from "react";
import FullCalendar , {formatDate} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from"@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import {tokens} from "../../theme";

const Calendar = () => {
    const theme = useTheme();
    const colors=tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState([]);
    
    const handleDateClick = (selected) => {
        const title = prompt("Please enter a new title for tour event");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: `${selected.dateStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,
            });
        }
    };
    const handleEvantClick = (selected) => {
        if (
            window.confirm(
                `Are you sure you want to delete the event '${selected.event.title}'`
            )
        ) {
           selected.event.remove();
        }
     };

     return(
        <Box m="20px">
          <Header title="CALENDAR" subtitle="Full Calendar Interative Page"/>

          <Box ></Box>
        </Box>
     )
};

export default Calendar;