const STORAGE_KEY = 'appointments_data';

function generateUniqueId() {
  return `apt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function validateAppointment(appointment) {
  const requiredFields = ['date', 'time', 'clientName', 'clientPhone', 'status'];
  
  for (const field of requiredFields) {
    if (!appointment[field] || appointment[field].toString().trim() === '') {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  return true;
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
      return [];
    }
    
    const parsed = JSON.parse(data);
    
    if (!Array.isArray(parsed)) {
      console.error('Corrupted data in localStorage: expected an array');
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load appointments from localStorage:', error);
    return [];
  }
}

function saveToStorage(appointments) {
  try {
    const data = JSON.stringify(appointments);
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (error) {
    console.error('Failed to save appointments to localStorage:', error);
    return false;
  }
}

function initializeAppointments() {
  const appointments = loadFromStorage();
  return appointments;
}

function createAppointment(appointmentData) {
  try {
    const newAppointment = {
      id: generateUniqueId(),
      date: appointmentData.date,
      time: appointmentData.time,
      clientName: appointmentData.clientName,
      clientPhone: appointmentData.clientPhone,
      status: appointmentData.status
    };
    
    validateAppointment(newAppointment);
    
    const appointments = loadFromStorage();
    appointments.push(newAppointment);
    
    const success = saveToStorage(appointments);
    
    if (success) {
      return { success: true, appointment: newAppointment };
    } else {
      return { success: false, error: 'Failed to save appointment' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getAllAppointments() {
  return loadFromStorage();
}

function getAppointmentsByDate(date) {
  const appointments = loadFromStorage();
  return appointments.filter(apt => apt.date === date);
}

function getAppointmentsByStatus(status) {
  const appointments = loadFromStorage();
  return appointments.filter(apt => apt.status === status);
}

function getAppointmentsByDateAndStatus(date, status) {
  const appointments = loadFromStorage();
  return appointments.filter(apt => apt.date === date && apt.status === status);
}

function getAppointmentById(id) {
  const appointments = loadFromStorage();
  return appointments.find(apt => apt.id === id);
}

function updateAppointment(id, updatedData) {
  try {
    const appointments = loadFromStorage();
    const index = appointments.findIndex(apt => apt.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedAppointment = {
      ...appointments[index],
      ...updatedData,
      id: appointments[index].id
    };
    
    validateAppointment(updatedAppointment);
    
    appointments[index] = updatedAppointment;
    
    const success = saveToStorage(appointments);
    
    if (success) {
      return { success: true, appointment: updatedAppointment };
    } else {
      return { success: false, error: 'Failed to update appointment' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function deleteAppointment(id) {
  try {
    const appointments = loadFromStorage();
    const index = appointments.findIndex(apt => apt.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const deletedAppointment = appointments[index];
    appointments.splice(index, 1);
    
    const success = saveToStorage(appointments);
    
    if (success) {
      return { success: true, appointment: deletedAppointment };
    } else {
      return { success: false, error: 'Failed to delete appointment' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function clearAllAppointments() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export {
  initializeAppointments,
  createAppointment,
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentsByStatus,
  getAppointmentsByDateAndStatus,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  clearAllAppointments,
  generateUniqueId,
  validateAppointment
};
