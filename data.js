const STORAGE_KEY = 'beautysalon_appointments';

export function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

export function createAppointment(appointmentData) {
    const appointments = getAllAppointments();
    
    const newAppointment = {
        id: generateId(),
        customerName: appointmentData.customerName,
        email: appointmentData.email,
        phone: appointmentData.phone,
        date: appointmentData.date,
        time: appointmentData.time,
        service: appointmentData.service,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    
    return newAppointment;
}

export function getAllAppointments() {
    const appointments = localStorage.getItem(STORAGE_KEY);
    return appointments ? JSON.parse(appointments) : [];
}

export function getAppointmentById(id) {
    const appointments = getAllAppointments();
    return appointments.find(appointment => appointment.id === id);
}

export function getAppointmentsByDate(date) {
    const appointments = getAllAppointments();
    return appointments.filter(appointment => appointment.date === date);
}

export function getAppointmentsByStatus(status) {
    const appointments = getAllAppointments();
    return appointments.filter(appointment => appointment.status === status);
}

export function updateAppointment(id, updatedData) {
    const appointments = getAllAppointments();
    const index = appointments.findIndex(appointment => appointment.id === id);
    
    if (index === -1) {
        return null;
    }
    
    appointments[index] = {
        ...appointments[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    return appointments[index];
}

export function deleteAppointment(id) {
    const appointments = getAllAppointments();
    const filteredAppointments = appointments.filter(appointment => appointment.id !== id);
    
    if (appointments.length === filteredAppointments.length) {
        return false;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAppointments));
    return true;
}

export function updateAppointmentStatus(id, status) {
    return updateAppointment(id, { status });
}

export function isTimeSlotAvailable(date, time) {
    const appointments = getAppointmentsByDate(date);
    return !appointments.some(appointment => 
        appointment.time === time && 
        appointment.status !== 'cancelled'
    );
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

initializeStorage();
