import {createContext} from 'react';

const EventContext = createContext({
    isOpen: false,
    setIsOpen: () => {},
    editOpen: false,
    setEditOpen: () => {},
    tasks: [],
    setTasks: () => {},
    selectedTask: null,
    setSelectedTask: () => {}
})

export default EventContext;