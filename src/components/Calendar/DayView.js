import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
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

// 👉 Własny wygląd kafelka wizyty
const CustomEvent = ({ event }) => (
  <div className="flex items-center space-x-2">
    <div className="w-6 h-6 flex items-center justify-center text-lg">
      {getServiceIcon(event.resource?.description)}
    </div>
    <div>
      <div className="font-semibold text-sm">{event.title}</div>
      <div className="text-xs text-gray-600">{event.resource?.description}</div>
    </div>
  </div>
);

// 👉 Pasek nawigacji z ikonami
const CustomToolbar = ({ label, onNavigate, onView, view, onBackToMonth }) => (
  <div className="rbc-toolbar custom-toolbar flex justify-between items-center">
    <div className="flex space-x-2">
      <button type="button" onClick={() => onNavigate('PREV')}><ArrowBackIosIcon fontSize="small" /></button>
      <button type="button" onClick={() => onNavigate('TODAY')}><TodayIcon fontSize="small" /></button>
      <button type="button" onClick={() => onNavigate('NEXT')}><ArrowForwardIosIcon fontSize="small" /></button>
    </div>
    <span className="text-lg font-medium">{label}</span>
    <div className="flex space-x-2">
      <button type="button" onClick={() => onView('month')}><ViewModuleIcon /></button>
      <button type="button" onClick={() => onView('week')}><ViewWeekIcon /></button>
      <button type="button" onClick={() => onView('day')}><ViewDayIcon /></button>
      <button type="button" onClick={() => onView('agenda')}><EventNoteIcon /></button>
      <button type="button" onClick={onBackToMonth} className="ml-2 text-sm text-blue-500 underline">← Powrót do miesiąca</button>
    </div>
  </div>
);

// 👉 Komponent DayView
const DayView = ({
  calendarEvents,
  selectedDate,
  handleSelectEvent,
  handleSelectSlot,
  handleEventDrop,
  handleEventResize,
  onBackToMonth,
  onView,
}) => {
  const eventPropGetter = (event) => {
    let backgroundColor = '#e5e7eb'; // szary domyślnie

    if (event.resource?.description?.toLowerCase().includes('mikro')) {
      backgroundColor = '#fbcfe8'; // róż
    } else if (event.resource?.description?.toLowerCase().includes('masaż')) {
      backgroundColor = '#bbf7d0'; // mięta
    } else if (event.resource?.description?.toLowerCase().includes('depilacja')) {
      backgroundColor = '#fde68a'; // żółty
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        padding: '4px 6px',
        border: '1px solid #d1d5db',
        color: '#1f2937',
        fontSize: '0.85rem',
      },
    };
  };

  return (
    <div className="day-view-container flex-1 bg-white rounded-lg shadow-lg p-6">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultView="day"
        views={['day']}
        date={selectedDate}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '700px' }}
        step={15}
        timeslots={2}
        min={new Date(0, 0, 0, 8, 0)}
        max={new Date(0, 0, 0, 20, 0)}
        components={{
          toolbar: (props) => <CustomToolbar {...props} onView={onView} onBackToMonth={onBackToMonth} />,
          event: CustomEvent,
        }}
        tooltipAccessor={(event) =>
          `${event.title}\n${event.resource?.description || ''}`
        }
        messages={{
          today: 'Dziś',
          day: 'Dzień',
          agenda: 'Agenda',
          noEventsInRange: 'Brak wizyt w tym dniu.',
        }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        resizable
        draggableAccessor={() => true}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default DayView;
