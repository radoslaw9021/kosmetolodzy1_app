import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import moment from 'moment';
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TodayIcon from '@mui/icons-material/Today';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import '../../styles/Calendar.css';

// Konfiguracja lokalizera
moment.locale('pl');
const localizer = momentLocalizer(moment);

// Funkcja do określania ikony na podstawie opisu usługi
const getServiceIcon = (desc) => {
    if (!desc) return '';
    const d = desc.toLowerCase();
    if (d.includes('mezoterapia')) return '🧬';
    if (d.includes('oczyszczanie')) return '💧';
    if (d.includes('laser')) return '🔦';
    if (d.includes('peeling')) return '✨';
    if (d.includes('mikrodermabrazja')) return '💎';
    if (d.includes('botoks')) return '💉';
    if (d.includes('kwas')) return '🧪';
    if (d.includes('masaż')) return '💆';
    if (d.includes('konsultacja')) return '👩‍⚕️';
    return '💅';
};

// Custom Event Component (reused from DayView and WeekView)
const CustomEvent = ({ event }) => {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`rbc-event ${event.type || 'other'}`}>
            <div className="rbc-event-content">
                <div className="event-avatar">
                    {event.clientAvatar ? (
                        <img src={event.clientAvatar} alt={event.clientName} />
                    ) : (
                        <div className="w-5 h-5 text-lg">
                            {getServiceIcon(event.resource?.description)}
                        </div>
                    )}
                </div>
                <div>
                    <div>{event.title}</div>
                    <div className="event-time">
                        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                    </div>
                    {event.resource?.description && (
                        <div className="text-xs text-gray-500">{event.resource.description}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom Toolbar Component (reused and adapted from DayView and WeekView)
const CustomToolbar = ({ label, onNavigate, onView, view }) => {
    return (
        <div className="rbc-toolbar custom-toolbar day-view-header">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('PREV')}><ArrowBackIosIcon fontSize="small" /></button>
                <button type="button" onClick={() => onNavigate('TODAY')}><TodayIcon fontSize="small" /></button>
                <button type="button" onClick={() => onNavigate('NEXT')}><ArrowForwardIosIcon fontSize="small" /></button>
            </span>
            <h2>{label}</h2> {/* Label here will be the agenda range */}
            <span className="rbc-btn-group">
                <button
                    type="button"
                    onClick={() => onView('month')}
                    className={view === 'month' ? 'rbc-active' : ''}
                >
                    <ViewModuleIcon />
                </button>
                <button
                    type="button"
                    onClick={() => onView('week')}
                    className={view === 'week' ? 'rbc-active' : ''}
                >
                    <ViewWeekIcon />
                </button>
                <button
                    type="button"
                    onClick={() => onView('day')}
                    className={view === 'day' ? 'rbc-active' : ''}
                >
                    <ViewDayIcon />
                </button>
                <button
                    type="button"
                    onClick={() => onView('agenda')}
                    className={view === 'agenda' ? 'rbc-active' : ''}
                >
                    <EventNoteIcon />
                </button>
            </span>
        </div>
    );
};

const AgendaView = ({
    calendarEvents,
    selectedDate,
    handleSelectEvent,
    handleSelectSlot,
    handleEventDrop,
    handleEventResize,
    onView
}) => (
    <div className="agenda-view-container flex-1 bg-white rounded-lg shadow-lg">
        <div className="p-6">
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                defaultView="agenda"
                views={['agenda', 'day', 'week', 'month']}
                date={selectedDate} // Changed to 'date' instead of 'defaultDate'
                startAccessor="start"
                endAccessor="end"
                style={{ height: '700px' }}
                components={{
                    toolbar: (props) => <CustomToolbar {...props} onView={onView} />,
                    event: CustomEvent
                }}
                tooltipAccessor={(event) =>
                    `${event.title}\n${event.resource?.description || ''}`
                }
                messages={{
                    next: 'Następny',
                    previous: 'Poprzedni',
                    today: 'Dziś',
                    month: 'Miesiąc',
                    week: 'Tydzień',
                    day: 'Dzień',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Godzina',
                    event: 'Wydarzenie',
                    noEventsInRange: 'Brak wizyt w tym zakresie.',
                    showMore: total => `+ ${total} więcej`,
                }}
                formats={{
                    dateFormat: 'dd.MM.yyyy',
                    dayFormat: (date, culture, localizer) =>
                        localizer.format(date, 'EEEE, dd.MM', culture),
                    timeGutterFormat: (date, culture, localizer) =>
                        localizer.format(date, 'HH:mm', culture),
                    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                        `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                        `${localizer.format(start, 'DD.MM', culture)} - ${localizer.format(end, 'DD.MM.YYYY', culture)}`,
                }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                resizable
                draggableAccessor={(event) => true}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
            />
        </div>
    </div>
);

export default AgendaView; 